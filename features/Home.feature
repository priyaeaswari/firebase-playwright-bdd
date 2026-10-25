Feature:Home page form
As a logged-in user
I want to fill in my personal details
So that I can submit my profile
Background:
Given I am logged in
@smoke @Home
Scenario: Submit the form with valid details
    When I fill in the form with valid details
    And I click the submit button
    Then the form should be submitted successfully