import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('ContrastGuard API Test Suite', () => {

  // 1. Health Endpoint Tests
  describe('GET /health', () => {
    it('1. should return 200 OK with expected health properties', async () => {
      const res = await request(app).get('/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'ok');
      assert.equal(res.body.service, 'contrastguard-api');
      assert.equal(res.body.version, '1.0.0');
      assert.equal(typeof res.body.uptime, 'number');
      assert.ok(res.body.timestamp);
    });
  });

  // 2. Content Negotiation on Root /
  describe('GET / (Content Negotiation)', () => {
    it('2. should return HTML Dark-Mode SaaS Landing Page when Accept: text/html', async () => {
      const res = await request(app)
        .get('/')
        .set('Accept', 'text/html');

      assert.equal(res.status, 200);
      assert.match(res.headers['content-type'], /text\/html/);
      assert.ok(res.text.includes('#090D16'), 'Contains dark theme background #090D16');
      assert.ok(res.text.includes('ContrastGuard'), 'Contains brand name');
      assert.ok(res.text.includes('https://rapidapi.com/artuturoh/api/contrastguard-wcag-color-contrast-and-accessibility-fixer'), 'Contains RapidAPI playground link');
      assert.equal(res.text.includes('github.com'), false, 'Does not include any GitHub links');
    });

    it('3. should return JSON metadata when Accept: application/json', async () => {
      const res = await request(app)
        .get('/')
        .set('Accept', 'application/json');

      assert.equal(res.status, 200);
      assert.match(res.headers['content-type'], /application\/json/);
      assert.equal(res.body.service, 'contrastguard-api');
      assert.ok(res.body.endpoints);
      assert.ok(res.body.endpoints.audit);
    });
  });

  // 3. POST /v1/audit & POST /v1/demo
  describe('POST /v1/audit — WCAG 2.1 & Color Science Engine', () => {
    it('4. should return exact 21.00:1 contrast ratio for Black & White', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#000000', background: '#FFFFFF' });

      assert.equal(res.status, 200);
      assert.equal(res.body.contrastRatio, 21.00);
      assert.equal(res.body.formattedRatio, '21.00:1');
      assert.equal(res.body.wcag21.grade, 'AAA');
      assert.equal(res.body.wcag21.normalTextAA, true);
      assert.equal(res.body.wcag21.normalTextAAA, true);
      assert.equal(res.body.wcag21.largeTextAA, true);
      assert.equal(res.body.wcag21.uiComponentsAA, true);
    });

    it('5. should return exact 1.00:1 contrast ratio for identical colors', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#FFFFFF', background: '#FFFFFF' });

      assert.equal(res.status, 200);
      assert.equal(res.body.contrastRatio, 1.00);
      assert.equal(res.body.formattedRatio, '1.00:1');
      assert.equal(res.body.wcag21.grade, 'FAIL');
      assert.equal(res.body.wcag21.normalTextAA, false);
      assert.equal(res.body.wcag21.contextPass, false);
    });

    it('6. should evaluate AA Normal Text threshold (>= 4.5)', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#3B82F6', background: '#0F172A', targetLevel: 'AA' });

      assert.equal(res.status, 200);
      assert.ok(res.body.contrastRatio >= 4.5);
      assert.equal(res.body.wcag21.normalTextAA, true);
      assert.equal(res.body.wcag21.contextPass, true);
    });

    it('7. should evaluate AAA Normal Text threshold (>= 7.0)', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#FFFFFF', background: '#1E293B', targetLevel: 'AAA' });

      assert.equal(res.status, 200);
      assert.ok(res.body.contrastRatio >= 7.0);
      assert.equal(res.body.wcag21.normalTextAAA, true);
      assert.equal(res.body.wcag21.grade, 'AAA');
      assert.equal(res.body.wcag21.contextPass, true);
    });

    it('8. should pass AA Large Text (ratio >= 3.0) for font size 24px', async () => {
      // #64748B on #0F172A is ~3.34:1 (fails normal AA 4.5, passes large AA 3.0)
      const res = await request(app)
        .post('/v1/audit')
        .send({
          foreground: '#64748B',
          background: '#0F172A',
          targetLevel: 'AA',
          fontSizePx: 24,
          fontWeight: 400
        });

      assert.equal(res.status, 200);
      assert.ok(res.body.contrastRatio >= 3.0 && res.body.contrastRatio < 4.5);
      assert.equal(res.body.wcag21.largeTextAA, true);
      assert.equal(res.body.wcag21.normalTextAA, false);
      assert.equal(res.body.wcag21.contextPass, true);
      assert.equal(res.body.wcag21.grade, 'AA Large Only');
    });

    it('9. should recognize 18.66px bold text (>= 700) as large text', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({
          foreground: '#64748B',
          background: '#0F172A',
          targetLevel: 'AA',
          fontSizePx: 19,
          fontWeight: 'bold'
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.wcag21.context.isLargeText, true);
      assert.equal(res.body.wcag21.contextPass, true);
    });

    it('10. should parse 3-digit hex colors accurately', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#FFF', background: '#000' });

      assert.equal(res.status, 200);
      assert.equal(res.body.foreground.hex, '#FFFFFF');
      assert.equal(res.body.background.hex, '#000000');
      assert.equal(res.body.contrastRatio, 21.00);
    });

    it('11. should parse rgb(r, g, b) colors correctly', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: 'rgb(59, 130, 246)', background: 'rgb(15, 23, 42)' });

      assert.equal(res.status, 200);
      assert.equal(res.body.foreground.hex, '#3B82F6');
      assert.equal(res.body.background.hex, '#0F172A');
    });

    it('12. should parse hsl(h, s, l) colors correctly', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: 'hsl(217.2, 91.2%, 59.8%)', background: 'hsl(0, 0%, 100%)' });

      assert.equal(res.status, 200);
      assert.ok(res.body.foreground.hex);
      assert.equal(res.body.background.hex, '#FFFFFF');
    });

    it('13. should calculate APCA Lc perceptual score and rating', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#000000', background: '#FFFFFF' });

      assert.equal(res.status, 200);
      assert.ok(typeof res.body.apca.lc === 'number');
      assert.ok(res.body.apca.lc > 90);
      assert.ok(res.body.apca.rating.includes('Preferred for body text'));
    });

    it('14. should trigger autoFix on failing color pair to strictly meet AA (>= 4.5)', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#94A3B8', background: '#FFFFFF', targetLevel: 'AA' });

      assert.equal(res.status, 200);
      assert.equal(res.body.wcag21.normalTextAA, false);
      assert.equal(res.body.autoFix.needed, true);
      assert.equal(res.body.autoFix.targetRatio, 4.5);
      assert.ok(res.body.autoFix.suggestedForegroundHex);
      assert.ok(res.body.autoFix.fixedContrastRatio >= 4.5);
      assert.notEqual(res.body.autoFix.deltaLightness, 0);
    });

    it('15. should trigger autoFix on failing color pair to strictly meet AAA (>= 7.0)', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#3B82F6', background: '#FFFFFF', targetLevel: 'AAA' });

      assert.equal(res.status, 200);
      assert.equal(res.body.autoFix.needed, true);
      assert.equal(res.body.autoFix.targetRatio, 7.0);
      assert.ok(res.body.autoFix.fixedContrastRatio >= 7.0);
    });

    it('16. should report autoFix not needed when colors already satisfy targetLevel', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#000000', background: '#FFFFFF', targetLevel: 'AA' });

      assert.equal(res.status, 200);
      assert.equal(res.body.autoFix.needed, false);
      assert.equal(res.body.autoFix.deltaLightness, 0);
    });

    it('17. should compute Protanopia color blindness simulation with contrast', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#3B82F6', background: '#0F172A' });

      assert.equal(res.status, 200);
      const sim = res.body.colorBlindnessSimulation.protanopia;
      assert.ok(sim);
      assert.match(sim.foregroundHex, /^#[0-9A-F]{6}$/);
      assert.match(sim.backgroundHex, /^#[0-9A-F]{6}$/);
      assert.ok(typeof sim.contrastRatio === 'number');
    });

    it('18. should compute Deuteranopia color blindness simulation with contrast', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#3B82F6', background: '#0F172A' });

      assert.equal(res.status, 200);
      const sim = res.body.colorBlindnessSimulation.deuteranopia;
      assert.ok(sim);
      assert.match(sim.foregroundHex, /^#[0-9A-F]{6}$/);
      assert.ok(typeof sim.contrastRatio === 'number');
    });

    it('19. should compute Tritanopia color blindness simulation with contrast', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#3B82F6', background: '#0F172A' });

      assert.equal(res.status, 200);
      const sim = res.body.colorBlindnessSimulation.tritanopia;
      assert.ok(sim);
      assert.match(sim.foregroundHex, /^#[0-9A-F]{6}$/);
      assert.ok(typeof sim.contrastRatio === 'number');
    });

    it('20. should compute Achromatopsia monochrome simulation with contrast', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#3B82F6', background: '#0F172A' });

      assert.equal(res.status, 200);
      const sim = res.body.colorBlindnessSimulation.achromatopsia;
      assert.ok(sim);
      assert.match(sim.foregroundHex, /^#[0-9A-F]{6}$/);
      assert.ok(typeof sim.contrastRatio === 'number');
    });

    it('21. should include execution time (<2ms) in meta', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#3B82F6', background: '#0F172A' });

      assert.equal(res.status, 200);
      assert.ok(typeof res.body.meta.execution_time_ms === 'number');
      assert.ok(res.body.meta.timestamp);
    });

    it('22. should return 400 Bad Request when foreground is missing', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ background: '#000000' });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Bad Request');
    });

    it('23. should return 400 Bad Request when background is missing', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#FFFFFF' });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Bad Request');
    });

    it('24. should return 400 Bad Request for invalid color format', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: 'not-a-color-xyz', background: '#FFFFFF' });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Bad Request');
      assert.ok(res.body.message.includes('Invalid'));
    });

    it('25. POST /v1/demo should function without authentication', async () => {
      const res = await request(app)
        .post('/v1/demo')
        .send({ foreground: '#3B82F6', background: '#0F172A' });

      assert.equal(res.status, 200);
      assert.ok(res.body.contrastRatio);
    });
  });

  // 4. POST /v1/palette Tests
  describe('POST /v1/palette — Design System Shade Scale Generator', () => {
    it('26. should generate complete 11-step Tailwind/CSS scale (50 to 950)', async () => {
      const res = await request(app)
        .post('/v1/palette')
        .send({ baseColor: '#3B82F6', background: '#FFFFFF' });

      assert.equal(res.status, 200);
      assert.equal(res.body.scale.length, 11);
      const expectedSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
      const actualSteps = res.body.scale.map(s => s.step);
      assert.deepEqual(actualSteps, expectedSteps);
    });

    it('27. should include hex, rgb, hsl, contrast, grade, and recommendedTextColor on each step', async () => {
      const res = await request(app)
        .post('/v1/palette')
        .send({ baseColor: '#10B981', background: '#0F172A' });

      assert.equal(res.status, 200);
      const step500 = res.body.scale.find(s => s.step === 500);
      assert.ok(step500);
      assert.match(step500.hex, /^#[0-9A-F]{6}$/);
      assert.match(step500.rgb, /^rgb\(\d+,\s*\d+,\s*\d+\)$/);
      assert.ok(step500.hsl.startsWith('hsl('));
      assert.ok(typeof step500.contrastAgainstBackground === 'number');
      assert.ok(['AAA', 'AA', 'AA Large Only', 'FAIL'].includes(step500.wcagGrade));
      assert.ok(['#FFFFFF', '#0F172A'].includes(step500.recommendedTextColor));
    });

    it('28. should return 400 Bad Request when baseColor is omitted', async () => {
      const res = await request(app)
        .post('/v1/palette')
        .send({});

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Bad Request');
    });

    it('29. should return 400 Bad Request when baseColor is invalid', async () => {
      const res = await request(app)
        .post('/v1/palette')
        .send({ baseColor: '#INVALID_HEX' });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Bad Request');
    });
  });

  // 5. POST /v1/batch Tests
  describe('POST /v1/batch — In-Memory Concurrent Auditor', () => {
    it('30. should audit multiple color pairs in memory concurrently', async () => {
      const pairs = [
        { id: 'brand_primary', foreground: '#3B82F6', background: '#0F172A', targetLevel: 'AA' },
        { id: 'brand_success', foreground: '#10B981', background: '#FFFFFF', targetLevel: 'AA' },
        { id: 'brand_danger', foreground: '#EF4444', background: '#18181B', targetLevel: 'AAA' }
      ];

      const res = await request(app)
        .post('/v1/batch')
        .send({ pairs });

      assert.equal(res.status, 200);
      assert.equal(res.body.count, 3);
      assert.equal(res.body.results.length, 3);
      assert.equal(res.body.results[0].id, 'brand_primary');
      assert.equal(res.body.results[0].status, 'success');
      assert.ok(res.body.results[0].contrastRatio);
      assert.ok(res.body.meta.execution_time_ms < 15);
    });

    it('31. should return 400 Bad Request when pairs array is empty', async () => {
      const res = await request(app)
        .post('/v1/batch')
        .send({ pairs: [] });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Bad Request');
      assert.ok(res.body.message.includes('cannot be empty'));
    });

    it('32. should return 400 Bad Request when pairs exceed 50 items', async () => {
      const pairs = Array.from({ length: 51 }, (_, i) => ({
        id: `pair_${i}`,
        foreground: '#FFF',
        background: '#000'
      }));

      const res = await request(app)
        .post('/v1/batch')
        .send({ pairs });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Bad Request');
      assert.ok(res.body.message.includes('Maximum allowed pairs per request is 50'));
    });

    it('33. should return 400 Bad Request when pairs is not an array', async () => {
      const res = await request(app)
        .post('/v1/batch')
        .send({ pairs: 'invalid-not-array' });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Bad Request');
    });

    it('34. should handle individual invalid pair gracefully within a batch', async () => {
      const pairs = [
        { id: 'valid_pair', foreground: '#FFF', background: '#000' },
        { id: 'bad_pair', foreground: 'bad_color_val', background: '#000' }
      ];

      const res = await request(app)
        .post('/v1/batch')
        .send({ pairs });

      assert.equal(res.status, 200);
      assert.equal(res.body.results[0].status, 'success');
      assert.equal(res.body.results[1].status, 'error');
      assert.ok(res.body.results[1].message.includes('Invalid foreground'));
    });
  });

  // 6. Security & RapidAPI Secret Middleware Tests
  describe('Security & RapidAPI Auth Middleware', () => {
    const TEST_SECRET = 'rapidapi_secret_test_xyz789';

    before(() => {
      process.env.RAPIDAPI_PROXY_SECRET = TEST_SECRET;
    });

    after(() => {
      delete process.env.RAPIDAPI_PROXY_SECRET;
    });

    it('35. should reject /v1/audit with 401 when X-RapidAPI-Proxy-Secret is missing', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .send({ foreground: '#FFF', background: '#000' });

      assert.equal(res.status, 401);
      assert.equal(res.body.error, 'Unauthorized');
      assert.ok(res.body.message.includes('RapidAPI proxy secret'));
    });

    it('36. should reject /v1/audit with 401 when X-RapidAPI-Proxy-Secret is invalid', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .set('X-RapidAPI-Proxy-Secret', 'wrong-secret')
        .send({ foreground: '#FFF', background: '#000' });

      assert.equal(res.status, 401);
      assert.equal(res.body.error, 'Unauthorized');
    });

    it('37. should accept /v1/audit when X-RapidAPI-Proxy-Secret matches', async () => {
      const res = await request(app)
        .post('/v1/audit')
        .set('X-RapidAPI-Proxy-Secret', TEST_SECRET)
        .send({ foreground: '#FFF', background: '#000' });

      assert.equal(res.status, 200);
      assert.equal(res.body.contrastRatio, 21.00);
    });

    it('38. should allow /v1/demo without secret even when RAPIDAPI_PROXY_SECRET is set', async () => {
      const res = await request(app)
        .post('/v1/demo')
        .send({ foreground: '#FFF', background: '#000' });

      assert.equal(res.status, 200);
      assert.equal(res.body.contrastRatio, 21.00);
    });

    it('39. should bypass /health and / without secret even when RAPIDAPI_PROXY_SECRET is set', async () => {
      const healthRes = await request(app).get('/health');
      assert.equal(healthRes.status, 200);

      const rootRes = await request(app).get('/').set('Accept', 'application/json');
      assert.equal(rootRes.status, 200);
    });
  });

  // 7. Security Headers & Routing Tests
  describe('Security Headers & Routing', () => {
    it('40. should set Helmet security headers (CSP, X-Content-Type-Options)', async () => {
      const res = await request(app).get('/health');
      assert.equal(res.headers['x-content-type-options'], 'nosniff');
      assert.ok(res.headers['content-security-policy']);
    });

    it('41. should return 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown-route-12345');
      assert.equal(res.status, 404);
      assert.equal(res.body.error, 'Not Found');
    });
  });

});
