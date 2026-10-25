import type {
  Reporter, FullConfig, Suite, TestCase, TestResult, FullResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

type TestRecord = {
  title: string;
  status: string;
  durationMs: number;
  tags: string[];
  error?: string;
};

class CustomListener implements Reporter {
  private results: TestRecord[] = [];
  private startTime = new Date();

  // Like onStart() in TestNG
  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = new Date();
    console.log(`\n🚀 Starting test run: ${suite.allTests().length} tests\n`);
  }

  // Like onTestStart()
  onTestBegin(test: TestCase) {
    console.log(`▶️  START: ${test.title}`);
  }

  // Like onTestSuccess / onTestFailure / onTestSkipped
  onTestEnd(test: TestCase, result: TestResult) {
    const error = result.error?.message?.split('\n')[0];

    if (result.status === 'passed') {
      console.log(`✅ PASSED: ${test.title} (${result.duration}ms)`);
    } else if (result.status === 'skipped') {
      console.log(`⏭️  SKIPPED: ${test.title}`);
    } else {
      console.log(`❌ FAILED: ${test.title} (${result.duration}ms)`);
      console.log(`   Reason: ${error}`);
    }

    // NEW: store each result for the report
    this.results.push({
      title: test.title,
      status: result.status,
      durationMs: result.duration,
      tags: test.tags,
      error,
    });
  }

  // Like onFinish()
  onEnd(result: FullResult) {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed' || r.status === 'timedOut').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;

    const summary = {
      status: result.status,
      startTime: this.startTime.toLocaleString(),
      total: this.results.length,
      passed,
      failed,
      skipped,
      tests: this.results,
    };

    // NEW: create the reports folder if it doesn't exist
    const dir = path.join(process.cwd(), 'reports');
    fs.mkdirSync(dir, { recursive: true });

    // NEW: JSON report
    fs.writeFileSync(path.join(dir, 'listener-report.json'), JSON.stringify(summary, null, 2));

    // NEW: HTML report
    const rows = this.results.map(r => `
      <tr class="${r.status}">
        <td>${r.title}</td>
        <td>${r.tags.join(' ')}</td>
        <td>${r.status.toUpperCase()}</td>
        <td>${r.durationMs} ms</td>
        <td>${r.error ?? ''}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Listener Report</title>
<style>
  body { font-family: Arial, sans-serif; margin: 32px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  th { background: #f4f4f4; }
  .passed td:nth-child(3) { color: green; font-weight: bold; }
  .failed td:nth-child(3), .timedOut td:nth-child(3) { color: red; font-weight: bold; }
</style></head>
<body>
  <h1>Test Run Summary</h1>
  <p>Started: ${summary.startTime} | Total: ${summary.total} |
     ✅ Passed: ${passed} | ❌ Failed: ${failed} | ⏭️ Skipped: ${skipped}</p>
  <table>
    <tr><th>Test</th><th>Tags</th><th>Status</th><th>Duration</th><th>Error</th></tr>
    ${rows}
  </table>
</body></html>`;

    fs.writeFileSync(path.join(dir, 'listener-report.html'), html);

    console.log(`\n🏁 Test run finished: ${result.status.toUpperCase()}`);
    console.log(`📄 Listener report: reports/listener-report.html\n`);
  }
}

export default CustomListener;