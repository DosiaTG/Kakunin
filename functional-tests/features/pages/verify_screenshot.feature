Feature: Screenshot page verification
    As a kakunin user
    I want to take screenshot of the current page

    @screen @currentElement
    Scenario: Take screenshot of the current elment
        Given I visit the "main" page
        And I wait for "visibilityOf" of the "formSelectLink" element
        When I take screenshot of the element "formSelectLink" and save as a "formSelectLink"
        Then I compare the screenshot of the element "formSelectLink" saved as "formSelectLink"

    @screen @partialPage
    Scenario: Take screenshot of the visible part of the page
        Given I visit the "main" page
        And I wait for "visibilityOf" of the "formSelectLink" element
        When I take screenshot of the visible part of the page and save as a "partialScreenshot"
        Then I compare the screenshot of visible the part of the page saved as "partialScreenshot"

    @screen @fullPage
    Scenario: Take full screenshot of the page
        Given I visit the "main" page
        And I wait for "visibilityOf" of the "formSelectLink" element
        When I take full screenshot of the page and save as a "fullScreenshot"
        Then I compare the full screenshot of the page  saved as "fullScreenshot"