Feature:
    The api contains Users

    Scenario: Requesting users without authentication should fail
        When I send a GET request to "/users"
        Then the response status code should be 401

    @login
    Scenario: Requesting users with authentication should succeed
        When I send a GET request to "/users"
        Then the response status code should be 200

    @login
    Scenario: I can request all users
        Given the following users exist:
            | username  | password  |
            | tester    | tester    |
            | new user  | newer     |
        When I send a GET request to "/users"
        Then the response should contain a collection
        And the response collection should contain:
            | username  |
            | tester    |
            | new user  |
        And items in the response collection should only have the following fields:
            | @id       |
            | @type     |
            | username  |

    @login
    Scenario: I can request a single user
        Given the following users exist:
            | username  | password  |
            | tester    | tester    |
            | new user  | newer     |
        When I send a GET request to "/users"
        Then the response should contain a collection
        And the response collection should contain:
            | username  |
            | tester    |
            | new user  |
        And items in the response collection should only have the following fields:
            | @id       |
            | @type     |
            | username  |
