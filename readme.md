# Demo Bank — Playwright Automated Tests

Automated end-to-end test project for the **Demo Bank** web application, created to practice and demonstrate web test automation using Playwright and TypeScript.

The project covers selected banking workflows, including authentication, payments and money transfers.

## Tech Stack

* **Playwright**
* **TypeScript**
* **Node.js**
* **Git / GitHub**
* **GitHub Actions** — CI test execution

## Test Scope

The automated test suite covers selected functional scenarios:

### Authentication

* Successful login
* Login with invalid credentials
* Required field validation
* Login input validation

### Payments and Transfers

* Money transfer
* Express transfer
* Mobile phone top-up
* Transfer form validation
* Account balance verification after transactions

The suite contains both **positive and negative test scenarios**.

## Project Structure

```text
demo-bank-tests/
├── components/     # Reusable UI components
├── pages/          # Page Object classes
├── configuration/  # Environment variables
├── test-data/      # Test data
├── tests/          # Playwright test specifications
├── utils/          # Helper functions
├── playwright.config.ts
└── package.json
```

The project uses the **Page Object Model** to separate test scenarios from page interaction logic and improve test maintainability.

## Installation

### Prerequisites

* Node.js
* npm

Clone the repository and install dependencies:

```bash
git clone https://github.com/PiotrPolanin/demo-bank-tests.git
cd demo-bank-tests
npm install
npx playwright install
```

## Running Tests

Run the complete test suite:

```bash
npm test
```

Run tests in headed mode:

```bash
npm run test:headed
```

Tests can also be executed by tags, for example:

```bash
npx playwright test --grep @smoke
npx playwright test --grep @login
npx playwright test --grep @payment
```

## Test Reports and Debugging

Playwright HTML reports are generated after test execution.

```bash
npx playwright show-report
```

The configuration also retains **traces and videos for failed tests** to support failure analysis.

## Continuous Integration

Automated tests are executed using **GitHub Actions**.

The CI pipeline runs the complete Playwright test suite against:

- Google Chrome
- Firefox
- WebKit (Safari engine)

The workflow is triggered automatically on:

- pushes to the `main` branch;
- pull requests targeting `main`.

It can also be executed manually from the GitHub Actions tab.

Each browser is executed as a separate matrix job. Playwright HTML
reports and failure artifacts are stored as GitHub Actions artifacts
for debugging.

## Project Goals

This project was created to develop practical experience in:

* designing automated E2E tests with Playwright;
* structuring test automation using Page Object Model;
* creating positive and negative test scenarios;
* working with reusable test data and UI components;
* using stable Playwright locators and assertions;
* debugging failed automated tests;
* maintaining tests when the tested application changes;
* integrating automated tests with CI.

## Test Environment

The tests use a publicly available Demo Bank application maintained by a third party.

Because the tested application is outside this repository and may be updated independently, changes to its UI, selectors or functionality may occasionally require corresponding updates to the automated tests.

---

**Note:** This is a personal test automation project created for learning and portfolio purposes.
