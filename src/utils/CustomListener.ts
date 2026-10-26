import type {
  Reporter, FullConfig, Suite, TestCase, TestResult, FullResult, TestError,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

type TestRecord = {
  title: string;
  browser: string;
  status: string;
  durationMs: number;
  retry: number;
  tags: string[];
  error?: string;
};

// Removes terminal colour codes like [31m ... [39m and keeps the first line
function cleanMessage(msg?: string): string | undefined {
  return msg?.replace(/\u001b\[[0-9;]*m/g, '').split('\n')[0];
}

class CustomListener implements Reporter {
  private results: TestRecord[] = [];
  private globalErrors: string[] = [];
  private startTime = new Date();

  // Browser (project) name of a test, e.g. chromium / firefox / webkit
  private browserOf(test: TestCase): string {
    return test.parent.project()?.name ?? 'unknown';
  }

  // Like onStart() in TestNG
  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = new Date();
    console.log(`\n🚀 Starting test run: ${suite.allTests().length} tests\n`);
  }

  // Errors outside any test (e.g. a step file fails to load)
  onError(error: TestError) {
    const msg = cleanMessage(error.message ?? String(error.value)) ?? 'Unknown error';
    this.globalErrors.push(msg);
    console.log(`💥 GLOBAL ERROR: ${msg}`);
  }

  // Like onTestStart()
  onTestBegin(test: TestCase, result: TestResult) {
    const retryInfo = result.retry > 0 ? ` (retry ${result.retry})` : '';
    console.log(`▶️  START [${this.browserOf(test)}]: ${test.title}${retryInfo}`);
  }

  // Like onTestSuccess / onTestFailure / onTestSkipped
  onTestEnd(test: TestCase, result: TestResult) {
    const browser = this.browserOf(test);
    const error = cleanMessage(result.error?.message);

    if (result.status === 'passed') {
      console.log(`✅ PASSED [${browser}]: ${test.title} (${result.duration}ms)`);
    } else if (result.status === 'skipped') {
      console.log(`⏭️  SKIPPED [${browser}]: ${test.title}`);
    } else {
      console.log(`❌ FAILED [${browser}]: ${test.title} (${result.duration}ms)`);
      console.log(`   Reason: ${error}`);
    }

    this.results.push({
      title: test.title,
      browser,
      status: result.status,
      durationMs: result.duration,
      retry: result.retry,
      tags: test.tags,
      error,
    });
  }

  // Like onFinish()
  onEnd(result: FullResult) {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed' || r.status === 'timedOut').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const totalSec = (result.duration / 1000).toFixed(1);

    const summary = {
      status: result.status,
      startTime: this.startTime.toLocaleString(),
      totalTimeSec: totalSec,
      total: this.results.length,
      passed,
      failed,
      skipped,
      globalErrors: this.globalErrors,
      tests: this.results,
    };

    const dir = path.join(process.cwd(), 'reports');
    fs.mkdirSync(dir, { recursive: true });

    // JSON report
    fs.writeFileSync(path.join(dir, 'listener-report.json'), JSON.stringify(summary, null, 2));

    // HTML report
    const rows = this.results.map(r => `
      <tr class="${r.status}">
        <td>${r.title}</td>
        <td>${r.browser}</td>
        <td>${r.tags.join(' ')}</td>
        <td>${r.status.toUpperCase()}${r.retry > 0 ? ` (retry ${r.retry})` : ''}</td>
        <td>${r.durationMs} ms</td>
        <td>${r.error ?? ''}</td>
      </tr>`).join('');

    const errorBlock = this.globalErrors.length
      ? `<p class="global"><b>Global errors:</b><br>${this.globalErrors.join('<br>')}</p>`
      : '';

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Listener Report</title>
<style>
  body { font-family: Arial, sans-serif; margin: 32px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  th { background: #f4f4f4; }
  .passed td:nth-child(4) { color: green; font-weight: bold; }
  .failed td:nth-child(4), .timedOut td:nth-child(4) { color: red; font-weight: bold; }
  .global { color: #b00020; background: #fdecea; padding: 10px; border-radius: 4px; }
</style></head>
<body>
  <h1>Test Run Summary</h1>
  <p>Started: ${summary.startTime} | Total time: ${totalSec}s | Total: ${summary.total} |
     ✅ Passed: ${passed} | ❌ Failed: ${failed} | ⏭️ Skipped: ${skipped}</p>
  ${errorBlock}
  <table>
    <tr><th>Test</th><th>Browser</th><th>Tags</th><th>Status</th><th>Duration</th><th>Error</th></tr>
    ${rows}
  </table>
</body></html>`;

    fs.writeFileSync(path.join(dir, 'listener-report.html'), html);

    console.log(`\n🏁 Test run finished: ${result.status.toUpperCase()}`);
    console.log(`⏱️  Total time: ${totalSec}s`);
    if (this.globalErrors.length) {
      console.log(`💥 Global errors: ${this.globalErrors.length} (see report)`);
    }
    console.log(`📄 Listener report: reports/listener-report.html\n`);
  }
}

export default CustomListener;