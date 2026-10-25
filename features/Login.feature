Feature:Firebase Web Login
    As a registered user
    I want to login to Firebase app
    So that I can access my account
Background:
    Given I am on the login page
@smoke
Scenario: Successful login with valid credentials
    When I enter a valid email and password
    And I click on the login button
    Then I should be logged in successfully
@regression
Scenario Outline: Unsuccessful login with <case>
When I enter email "<email>" and password "<password>"
And I click on the login button
Then I should not be able to login
Examples:
|case|email|password|
|invalid credentials|invalid.user@gmail.com|invalid@123|
|wrong password|VALID_EMAIL|invalid password|
|empty credentials| |  |
