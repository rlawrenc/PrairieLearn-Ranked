**Question sharing is currently in beta.** If your course is hosted on the official PrairieLearn server, you may request that question sharing be turned on for your course. If you administer your own PrairieLearn server, you should _not_ use question sharing at this time. In the future, question sharing may be supported across PrairieLearn servers, so turning on question sharing on unofficial servers at this point in time may lead to naming conflicts in the future.

# Question Sharing

In order to avoid instructors needing to copy question files in between courses, PrairieLearn provides a way for questions from one course to be used in assessments in other courses.

## Sharing Names

In order for another course to use questions from your course into their assessments, you must have chosen a _sharing name_ for your course that they will use as a prefix to your question IDs when using them. This sharing name will be unique across all PrairieLearn instances and because it will be used in the JSON files for other courses, there will be no way to change the sharing name for your course once you have chosen it. It is recommended that you choose something short but descriptive. For example, if you're teaching a calculus course at a university that goes by the abbreviation 'XYZ', then you could choose the sharing name 'xyz-calculus'. Then other courses will use questions from your course with the syntax `@xyz-calculus/qid`.

## Sharing Sets

Access to shared questions is controlled through **sharing sets**. A sharing set is a named set of questions which you can share to another course all at once. The sharing set system exists so that course owners may differentially share different sets of their questions. For example, and instructor may want to share some questions only with other courses in their department, and other questions with anyone using PrairieLearn. For security reasons, only course owners are allowed to edit sharing sets and sharing set permissions, and all sharing information is kept exclusively in the database, not in any of the JSON files that declare the course content. Sharing sets are edited from the 'Sharing' tab of the course administration page.

## Sharing a sharing set with connection with another course

For security reasons, establishing the connection for one course to share questions with another course requires coordinated action by owners of the course sharing the questions (which we will refer to hereafter as the 'sharing course') and the course that is using the questions that are being shared ('which we will refer to hereafter as the 'consuming course')

In order to allow someone to share their questions with your course, you must provide them with the 'Sharing Token' listed on the 'Sharing' tab of your instructor settings page. Then the sharing course must use the sharing token which you provide to them to add your course as a consumer of one of their sharing sets.

## Using shared questions

To refer to a question from another course, use the question id (qid) prefixed by the `@` symbol and the sharing name of the other course. For example, to use the question `addNumbers` from the course with sharing name `test-course`, you would put `@test-course/addNumbers` into your `assessmentInfo.json`. In the context of the `assessmentInfo.json`, this may look like:

```json
"zones": [
    {
        "title": "Question Sharing Example",
        "comment": "These are new questions created for this exam",
        "questions": [
            {"id": "addNumbers", "autoPoints": [10, 5, 3, 1, 0.5, 0.25]},
            {"id": "@test-course/addNumbers", "autoPoints": [10, 9, 7, 5]}
        ]
    },
]
```

## Steps to share a question for the first time

1. On your course admin page, visit the 'sharing' tab
2. Choose a sharing name for your course
3. Create a sharing set
4. Have the instructor or the course you would like to share your question with visit the 'sharing' tab on their course admin page and provide you with their course's sharing token
5. Use the provided sharing token to add the other instructor's course as a consumer of the sharing set you created
6. Visit the question settings page for the question you would like to share, and add it to the sharing set
7. The course you have shared the question with may now use it by referencing it in their assessments
