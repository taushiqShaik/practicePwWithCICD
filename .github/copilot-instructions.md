# Copilot Instructions for Playwright Test Automation

## Architecture Overview

This is a Playwright test automation project using the Page Object Model (POM) pattern with a centralized PageManager for dependency injection. The architecture separates concerns into distinct layers:

- **Pages/** - Page classes extending `HelperBase` for page interactions
- **Locators/** - CommonJS modules exporting element selectors (mix of XPath and CSS)
- **Fixtures/** - Base classes and utilities (`HelperBase` provides common functionality)
- **Tests/** - Test specifications using `test.describe.configure({mode: 'serial'})`
- **Utils/** - Shared test data in JSON format

## Page Object Model Pattern

Pages inherit from `HelperBase` and are instantiated through `PageManager`:

```typescript
// In tests - always use PageManager
const pm = new PageManager(page);
await pm.onTextBoxPage().clickOnElementsLink();
await pm.onLoginPage().loginUsingCredentials(username, password);
```

**Key Pattern**: All page methods should be action-oriented and accept parameters rather than accessing test data directly.

## Locator Strategy

This project uses **CommonJS exports** for locators (not ES6 modules):

```typescript
// locators/example.locators.ts
module.exports = {
  elementName: "//xpath[@id='example']",
  buttonName: "button-id",
};

// In page classes
const { elementName, buttonName } = require("../locators/example.locators");
```

**Mixed Selector Strategy**: Combines XPath for complex elements and CSS/test-id for simple ones.

## Test Data Management

Test data is centralized in `utils/data.json` and loaded synchronously:

```typescript
const fs = require("fs");
const testData = JSON.parse(fs.readFileSync(`./utils/data.json`, `utf-8`));
```

**Critical**: Always use `testData.property_name` to access URLs, credentials, and test values.

## Test Structure Conventions

- Use `test.describe.configure({mode: 'serial'})` for sequential test execution
- Set timeout in `beforeEach`: `test.setTimeout(90000)`
- Navigate in `beforeEach` hook using `testData` URLs
- Use `test.skip()` for temporarily disabled tests

## Reporting & CI/CD

- **Allure Reporting**: Configured with `allure-playwright` reporter
- **Scripts**:
  - `npm run allure:report` - Generate reports
  - `npm run allure:open` - View reports
- **CI Pipeline**: GitHub Actions with artifact upload for `playwright-report/`
- **Media Capture**: Screenshots/videos on failure, traces on retry

## Development Workflow Commands

```bash
# Run tests
npm test

# Generate and view Allure reports
npm run allure:report
npm run allure:open

# Install browsers (first time setup)
npx playwright install --with-deps
```

## Critical Patterns to Follow

1. **Never instantiate pages directly** - always use `PageManager`
2. **Use CommonJS require()** for locator imports, not ES6 imports
3. **Extend HelperBase** for all page classes to inherit common utilities
4. **Pass data as parameters** to page methods rather than accessing globals
5. **Use test.describe.configure({mode: 'serial'})** for test organization
6. **Load test data synchronously** using fs.readFileSync in test files

## File Naming Conventions

- Test files: `##_TestName.spec.ts` (e.g., `01_TextBox.spec.ts`)
- Page files: `PageName.ts` (e.g., `TextBoxPage.ts`)
- Locator files: `pageName.locators.ts` (e.g., `textBox.locators.ts`)

## Multi-Browser Testing

Configured for Chromium, Firefox, and WebKit. Use `projects` configuration in `playwright.config.ts` to add/modify browser support.
