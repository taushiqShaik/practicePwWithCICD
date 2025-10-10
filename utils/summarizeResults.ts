const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

interface TestResult {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  passPercentage: number;
  failPercentage: number;
  duration: string;
}

class TestResultsSummarizer {
  private emailConfig: any;
  private allureResultsPath: string;
  private recipientEmails: string[];

  constructor() {
    // Load configuration - prefer environment variables in CI
    let testData: any = {};

    try {
      testData = JSON.parse(fs.readFileSync(`./utils/data.json`, `utf-8`));
    } catch (error) {
      console.log("⚠️  Could not load data.json, using environment variables");
    }

    this.emailConfig = {
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER || testData.gmail_user,
        pass: process.env.GMAIL_APP_PASSWORD || testData.gmail_app_password,
      },
    };

    this.recipientEmails = testData.recipient_emails || [
      this.emailConfig.auth.user,
    ];
    this.allureResultsPath = "./allure-results";
  }

  /**
   * Parse Allure results and extract test statistics
   */
  private parseAllureResults(): TestResult {
    try {
      if (!fs.existsSync(this.allureResultsPath)) {
        console.log("❌ Allure results directory not found");
        return this.getDefaultResults();
      }

      const allureFiles = fs.readdirSync(this.allureResultsPath);
      const testResultFiles = allureFiles.filter((file: string) =>
        file.endsWith("-result.json")
      );

      if (testResultFiles.length === 0) {
        console.log("❌ No test result files found");
        return this.getDefaultResults();
      }

      let totalTests = 0;
      let passedTests = 0;
      let failedTests = 0;
      let skippedTests = 0;
      let totalDuration = 0;

      testResultFiles.forEach((file: string) => {
        const filePath = path.join(this.allureResultsPath, file);
        const testResult = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        totalTests++;
        totalDuration += testResult.stop - testResult.start;

        switch (testResult.status) {
          case "passed":
            passedTests++;
            break;
          case "failed":
            failedTests++;
            break;
          case "skipped":
            skippedTests++;
            break;
        }
      });

      const passPercentage =
        totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
      const failPercentage =
        totalTests > 0 ? Math.round((failedTests / totalTests) * 100) : 0;
      const duration = this.formatDuration(totalDuration);

      return {
        totalTests,
        passedTests,
        failedTests,
        skippedTests,
        passPercentage,
        failPercentage,
        duration,
      };
    } catch (error) {
      console.error("Error parsing Allure results:", error);
      return this.getDefaultResults();
    }
  }

  private getDefaultResults(): TestResult {
    return {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      passPercentage: 0,
      failPercentage: 0,
      duration: "0s",
    };
  }

  /**
   * Format duration from milliseconds to readable format
   */
  private formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }

  /**
   * Create HTML email content
   */
  private createEmailHtml(results: TestResult): string {
    const emoji = results.failedTests === 0 ? "✅" : "❌";
    const statusColor = results.failedTests === 0 ? "#28a745" : "#dc3545";
    const statusGradient =
      results.failedTests === 0
        ? "linear-gradient(90deg, #28a745 0%, #6f42c1 100%)"
        : "linear-gradient(90deg, #dc3545 0%, #ffc107 100%)";

    const buildInfo = process.env.GITHUB_RUN_NUMBER
      ? `Build #${process.env.GITHUB_RUN_NUMBER}`
      : "Local Run";

    const branch = process.env.GITHUB_REF_NAME || "local";
    const timestamp = new Date().toLocaleString();
    const repository = process.env.GITHUB_REPOSITORY || "Local Repository";

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Playwright Test Results</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #2d3748;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            
            .email-container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                overflow: hidden;
                position: relative;
            }
            
            .header {
                background: ${statusGradient};
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
                animation: float 20s ease-in-out infinite;
                z-index: 1;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(1deg); }
            }
            
            .header-content {
                position: relative;
                z-index: 2;
            }
            
            .header h1 {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .header-subtitle {
                font-size: 1.1rem;
                opacity: 0.9;
                font-weight: 300;
            }
            
            .status-badge {
                display: inline-block;
                padding: 8px 20px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50px;
                margin-top: 15px;
                font-weight: 500;
                backdrop-filter: blur(10px);
            }
            
            .summary {
                padding: 40px 30px;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            }
            
            .summary-title {
                font-size: 1.8rem;
                font-weight: 600;
                color: #1a202c;
                margin-bottom: 30px;
                text-align: center;
                position: relative;
            }
            
            .summary-title::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 80px;
                height: 3px;
                background: ${statusGradient};
                border-radius: 2px;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .stat-card {
                background: white;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                text-align: center;
                position: relative;
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border-left: 5px solid #007bff;
            }
            
            .stat-card:nth-child(1) { border-left-color: #6f42c1; }
            .stat-card:nth-child(2) { border-left-color: #28a745; }
            .stat-card:nth-child(3) { border-left-color: #dc3545; }
            .stat-card:nth-child(4) { border-left-color: #ffc107; }
            .stat-card:nth-child(5) { border-left-color: #17a2b8; }
            
            .stat-card::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, rgba(0, 123, 255, 0.1) 0%, transparent 70%);
                border-radius: 50%;
                transform: translate(30px, -30px);
            }
            
            .stat-icon {
                font-size: 2.5rem;
                margin-bottom: 15px;
                display: block;
            }
            
            .stat-title {
                font-size: 0.9rem;
                font-weight: 500;
                color: #64748b;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .stat-value {
                font-size: 2rem;
                font-weight: 700;
                color: #1e293b;
                position: relative;
                z-index: 2;
            }
            
            .stat-percentage {
                font-size: 1rem;
                font-weight: 500;
                margin-left: 8px;
            }
            
            .pass { color: #28a745; }
            .fail { color: #dc3545; }
            .info { color: #17a2b8; }
            
            .progress-section {
                background: white;
                padding: 30px;
                border-radius: 15px;
                margin-bottom: 20px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            }
            
            .progress-bar {
                width: 100%;
                height: 20px;
                background: #e2e8f0;
                border-radius: 10px;
                overflow: hidden;
                margin-top: 15px;
                position: relative;
            }
            
            .progress-fill {
                height: 100%;
                background: ${statusGradient};
                border-radius: 10px;
                width: ${results.passPercentage}%;
                transition: width 2s ease-in-out;
                position: relative;
                overflow: hidden;
            }
            
            .progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: shimmer 2s infinite;
            }
            
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .progress-text {
                text-align: center;
                margin-top: 10px;
                font-weight: 600;
                color: #4a5568;
            }
            
            .footer {
                background: #1a202c;
                color: #e2e8f0;
                padding: 30px;
                text-align: center;
                position: relative;
            }
            
            .footer-content {
                position: relative;
                z-index: 2;
            }
            
            .footer-title {
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 15px;
                color: #fff;
            }
            
            .footer-details {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .footer-item {
                padding: 10px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                backdrop-filter: blur(10px);
            }
            
            .footer-label {
                font-size: 0.8rem;
                opacity: 0.7;
                margin-bottom: 5px;
            }
            
            .footer-value {
                font-weight: 500;
                color: #f7fafc;
            }
            
            .workflow-link {
                display: inline-block;
                margin-top: 15px;
                padding: 12px 25px;
                background: ${statusGradient};
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 500;
                transition: transform 0.2s ease;
            }
            
            .workflow-link:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .playwright-logo {
                position: absolute;
                bottom: 20px;
                right: 20px;
                opacity: 0.1;
                font-size: 3rem;
            }
            
            @media (max-width: 600px) {
                .stats-grid {
                    grid-template-columns: 1fr;
                }
                
                .header h1 {
                    font-size: 2rem;
                }
                
                .email-container {
                    margin: 10px;
                    border-radius: 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <header class="header">
                <div class="header-content">
                    <h1>${emoji} Test Results</h1>
                    <p class="header-subtitle">Playwright Automation Report</p>
                    <div class="status-badge">${buildInfo}</div>
                </div>
            </header>
            
            <div class="summary">
                <h2 class="summary-title">Execution Summary</h2>
                
                <div class="progress-section">
                    <h3>Success Rate: ${results.passPercentage}%</h3>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">
                        ${results.passedTests} out of ${
      results.totalTests
    } tests passed
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-icon">📊</span>
                        <div class="stat-title">Total Tests</div>
                        <div class="stat-value">${results.totalTests}</div>
                    </div>
                    
                    <div class="stat-card">
                        <span class="stat-icon">✅</span>
                        <div class="stat-title">Passed</div>
                        <div class="stat-value pass">
                            ${results.passedTests}
                            <span class="stat-percentage">(${
                              results.passPercentage
                            }%)</span>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <span class="stat-icon">❌</span>
                        <div class="stat-title">Failed</div>
                        <div class="stat-value fail">
                            ${results.failedTests}
                            <span class="stat-percentage">(${
                              results.failPercentage
                            }%)</span>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <span class="stat-icon">⏭️</span>
                        <div class="stat-title">Skipped</div>
                        <div class="stat-value info">${
                          results.skippedTests
                        }</div>
                    </div>
                    
                    <div class="stat-card">
                        <span class="stat-icon">⏱️</span>
                        <div class="stat-title">Duration</div>
                        <div class="stat-value info">${results.duration}</div>
                    </div>
                </div>
            </div>
            
            <footer class="footer">
                <div class="footer-content">
                    <h3 class="footer-title">🎭 Playwright Test Automation</h3>
                    
                    <div class="footer-details">
                        <div class="footer-item">
                            <div class="footer-label">Repository</div>
                            <div class="footer-value">${repository}</div>
                        </div>
                        
                        <div class="footer-item">
                            <div class="footer-label">Branch</div>
                            <div class="footer-value">${branch}</div>
                        </div>
                        
                        <div class="footer-item">
                            <div class="footer-label">Environment</div>
                            <div class="footer-value">${
                              process.env.NODE_ENV || "Local"
                            }</div>
                        </div>
                        
                        <div class="footer-item">
                            <div class="footer-label">Executed</div>
                            <div class="footer-value">${timestamp}</div>
                        </div>
                    </div>
                    
                    ${
                      process.env.GITHUB_RUN_NUMBER
                        ? `<a href="https://github.com/${repository}/actions/runs/${process.env.GITHUB_RUN_ID}" class="workflow-link">
                             🔗 View Workflow Details
                           </a>`
                        : ""
                    }
                </div>
                
                <div class="playwright-logo">🎭</div>
            </footer>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Send email with test results
   */
  private async sendEmail(results: TestResult): Promise<void> {
    if (!this.emailConfig.auth.user || !this.emailConfig.auth.pass) {
      console.log(
        "❌ Gmail credentials not configured. Skipping email notification."
      );
      console.log(
        "Expected environment variables: GMAIL_USER, GMAIL_APP_PASSWORD"
      );
      return;
    }

    try {
      const transporter = nodemailer.createTransport(this.emailConfig);

      const emoji = results.failedTests === 0 ? "✅" : "❌";
      const buildInfo = process.env.GITHUB_RUN_NUMBER
        ? `Build #${process.env.GITHUB_RUN_NUMBER}`
        : "Local Run";

      const mailOptions = {
        from: this.emailConfig.auth.user,
        to: this.recipientEmails.join(", "),
        subject: `${emoji} Playwright Test Results - ${buildInfo} (${results.passedTests}/${results.totalTests} Passed)`,
        html: this.createEmailHtml(results),
        attachments: [
          {
            filename: "test-summary.json",
            content: JSON.stringify(results, null, 2),
            contentType: "application/json",
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Test results sent to Gmail successfully!");
      console.log(`📧 Email sent to: ${this.recipientEmails.join(", ")}`);
    } catch (error) {
      console.error("❌ Error sending email:", error);
    }
  }

  /**
   * Generate and send test results summary
   */
  async generateSummary(): Promise<void> {
    try {
      console.log("📊 Generating test results summary...");

      const results = this.parseAllureResults();

      // Console output for GitHub Actions logs
      console.log("\n📋 TEST RESULTS SUMMARY");
      console.log("========================");
      console.log(`Total Tests: ${results.totalTests}`);
      console.log(
        `✅ Passed: ${results.passedTests} (${results.passPercentage}%)`
      );
      console.log(
        `❌ Failed: ${results.failedTests} (${results.failPercentage}%)`
      );
      console.log(`⏭️ Skipped: ${results.skippedTests}`);
      console.log(`⏱️ Duration: ${results.duration}`);
      console.log("========================\n");

      // Send email notification
      await this.sendEmail(results);

      // Write summary to file for CI artifacts
      const summaryFile = path.join("./allure-results", "test-summary.json");
      fs.writeFileSync(summaryFile, JSON.stringify(results, null, 2));
      console.log(`📄 Summary saved to: ${summaryFile}`);
    } catch (error) {
      console.error("❌ Error generating summary:", error);
      // Don't exit with error in CI to avoid failing the workflow
      if (process.env.CI) {
        console.log("⚠️  Continuing workflow despite summary error");
      } else {
        process.exit(1);
      }
    }
  }
}

// Export for use in other modules
module.exports = { TestResultsSummarizer };

// Allow direct execution
if (require.main === module) {
  const summarizer = new TestResultsSummarizer();
  summarizer.generateSummary();
}
