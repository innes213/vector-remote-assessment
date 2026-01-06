# Engineering Leadership

## Technical Trade-offs
* Shortcuts
In my sample implementation, my goal was to show a model of how data would move through a system analyzing large amounts of data accurately. A number of shortcuts were taken.
### Functional
* Limited supported incoming data type to one type
* No batch data handling
* Analysis is rudimentary
* Alerting is very primitive
* No analytics or proper logging
* No code security checks
* Overly simple error handling

### Structural
* Scale not consiered
* Services are contained in one app

## Balancing Time Contraints
 When thinking about time or other resource contraints, focus is on the most important priority. For a medical system, that's patient safety. Therefore, accuracy and reliability are paramount and take precidence over capacity and advanced features.
In a two-week implementation I would prioritize on analysis accuracy and alert delivery over scale and diversity. I would stick to a more monolithic structure over a distributed system of independently scalable stages.
Safety is the gatekeeper this type of application when thinking about time to market. This could be a bottleneck in the development process. If an issue is not found until just before deployment, or worse, in production, it is more costly to fix than if caught early on. Some tactics to utilize are:
* CI/CD pipeline with automated test runs
* Githooks to block pushes that don't pass unit tests
* ~100% unit test coverage of critical functionality
* Test environment that mimics production
* Automated acceptence tests before deployment

When it comes to testing, the goal is to ensure proper functionality and performance. There will always be bugs, but the later they are caught, the more expensive it is to fix. The ugly truth is that the "happy path" is only one of many paths that occur.

At the code level, unit tests should generally cover 80% of code and 100% of critical code. Critical code in the scenario relates to patient safety. Every single helper function should not be tested explicitly as this leads to friction when refactoring. The behavior of the component is what is important. Unit tests should be independent and individually runnable w/o context from other tests.
Acceptence or end-to-end tests should cover product requirements and be run prior to deployments/releases.


## Team & Process
Estimation is the starting point for work assignment. The most accurate estimates are based on past work that was similar or by breaking work down into the smallest possible pieces.
When it comes to assigning work, beyond logistics of making sure the load is evenly distributed and accounting for availability, the considerations I keep in mind are:
1. Each engineer's strengths - who will get it done the fastest?
2. Each engineer's professional goals - who would learn and develop from doing this?
3. Diversity of assignments - avoid pidgeon-holing 

Assuming there are no CI/CD qulaity processes in place, the following should be top priority to ensure quality:
1. Automated lint and unit test runs upon push to remote and merge to `main`
2. Acceptence tests before deploy
3. Code security scanning upon merge

To ensure quality over time, regular acceptence/end-to-end tests should be run and results compared against a "golden-reference" and the delta tracked to ensure results stay within tolerance.

## Cross-Functional Collaboration
It is Engineering's job to provide Product with deliverables that meet Product's goals. Engineering can best accomplish this by having a clear vision of the Product goal and roadmap as infrastructure, workflows, and features are built. Product and Engineering should endeavor to work more closely at the early stages of deelopment. This process starts with each function gaining a rudimentary understanding of the priorities and constraints of the other. A process that has worked well is early communication with Product about broad, high level goals, and providing Product with key strengths and limitations of Engineering. As product requirements are refined, and engineering requirements emerge, both sides have a sense of what the other is working with. 
When thinking about clinical operations, these should be captured as product requirements and used to drive QA testing and derive engineering requirements.
Communication and collaboration are key when coordinating with other technical teams. It is important to know what other teams are working on and how they might impact other teams and how they serve business goals. In the case of conflict, business goals are the guide to resolution. 