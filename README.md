# Spw!

(it's pronounced "swoop")

## What is this?

Spw is a subject-oriented programming language that evolved out of a need to eloquently describe & reference vast amounts of multi-modal data.

The main requirements are as follows

1. It should provide concise methods to describe the relationship between one concept and another
   
    a. The output should be as concise as the input
2. It should be flexible
   
   a. One concept may be referenced by multiple labels
   1. (e.g. "Sam" as shorthand for "Sam Washington")x`sx
   b. Concepts have context-dependent features or behaviors
   1. (e.g. an egg is not runny if it's been boiled)

Turns out, improving what already exists in this space is a doozy of a project. Fun!

## What is this? Longer version

Nowadays, this is mostly this is a satisfying exploration of what it'd take to write a programming language.

When it started, I was in college working on growing a student org called Student Body for Meaningful Education (SBME).
The main idea behind SBME was that crowdsourcing incremental improvement of teaching strategies would be neat, and a lot of people want to contribute but don't have a centralized place to.
As it turns out, the hard part isn't finding people who want to improve education strategies, it's coordinating an effort so broad.

Enter Spw.
What began as a system I used to tag content began gaining dimension, especially as I collected more resources and planned for making the effort intimately relevant to more students and faculty.

### Concept

The root of Spw is the idea of a concept. A concept is a label that has some sort of essence.

##### Anchors (similar to variable/primitive)

In Spw, labels of concepts that reference ideas are called "anchors". An ampersand (&) represents an abstract concept.
- `anchor`
- `"String"`
- `this is a phrase`
- `ball`
- `"There are no more cans"`
- `after the party`

##### Essences (similar to object/array/set)

Essences consist a collection of concepts. The order of concepts in an essence is assumed to be based on salience relative to the essence's anchor or the domain of attachment
They describe the concept they are attached to, either specifying a concept (no dot) or describing a concept (with a dot).

- `anchor[ phrase in essence ]`
- `thing[ red, has wheels ]`
- `runner.[ sweaty after runs ]`

##### Domains (similar to object/array/set)

Domains specify context or describe implementation
- `{_context concept implementation_}`
-
  ```
      {_paper
          sun[yellow], 
          dog, 
          grass      
      crayon_}
  ```
-
  ```
      {_realLife
          sun[orange], 
          dog, 
          grass      
      < 
          { #hydrogen, #fur, #chlorophyl }
      >_}
  ```

##### Evaluation (similar to function)

##### Transport (similar to assignment/control flow statement)
