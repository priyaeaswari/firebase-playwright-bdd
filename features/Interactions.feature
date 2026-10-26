Feature:Intractions menu
    As a logged-in user
    I want to open the intraction menu
    So that I can reach the intraction pages
Background:
    Given I am logged in
@intractions @smoke
Scenario:Intractions menu shows its submenu options
    When I open the Intractions menu
    Then I should see these menu options:
    |Drag & Drop|
    |Mouse Hover|
    |Double Click|
    |Tool Tip|
@intractions
Scenario:Drag an item into the drop area
    When I open "Drag & Drop" from the "Intractions" menu
    And  I drag the item into the drop area
    Then the item should be in drop area
@intractions
Scenario:Hovering the mouse Hover button shows its options
    When I open "Mouse Hover" from the "Intractions" menu
    And I hover over the "mousehover" button
    Then I should see these menu options:
    |Alert|
    |Windows|
    |Tabs|
@intractions
Scenario Outline:Clicking "<option>" from hover menu shows a pop up
    When I open "Mouse Hover" from the "Intractions" menu
    And I hover over the "mousehover" button
    And I click the "<option>" option
    Then I should see a pop-up with the message "<message>"
    Examples:
    |option|message|
    |Alert|Alert is Clicked|
    |Windows|Windows is Clicked|
    |Tabs|Tabs is Clicked|