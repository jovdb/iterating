# Iterating arrays

[TL;DR...](https://jovdb.github.io/iterating/)

If I look to my code, I see a lot of code in this style:

```
const liquidDegrees = kelvinTemperatures
    .map(kelvinToCelcius)
    .filter(isLiquid);
```

I know this not the most performant code, but it is easy to read and understand.

To measure the speed and investigate if there are better alternatives, I created some tests that use alternative principles for iterating over lists with operators (like `filter`, `map`, `some`,...)
- transducers
- generators
- callbags

For speed comparison with loops that don't use operators, I also included:
- for
- for-of
- forEach
- reduce

[Try the alternatives here...](https://jovdb.github.io/iterating/)

## transducers:
'Transducer' is a combination of the words 'TRANSformer' and 'reDUCER'.

With tranducers, all the operators (`filter`, `map`, ...) are internally written as a reduce function. 
When performing a `filter` and `map` on an array, the reduce functions of `filter` and `map` are chained as one reduce function, so the operators can be performed with 1 iteration, without temporary arrays.

This solution works not only on arrays but also on Iterators.

```
const liquidDegrees = pipe(
    kelvinTemperatures,
    map(kelvinToCelcius),
    filter(isLiquid),
    toArray(), // Not needed, also forEach possible
);
```
Remark: I didn't create the classical functional transduce function, but a simplified version that can be constucted with `pipe`.

## generators:
Generators are functions that let you write more easily Iterators by using the yield keyword.

It uses Lazy Evaluation, so infinite data streams can be represented.

```
const liquidDegrees = pipe(
    kelvinTemperatures,
    map(kelvinToCelcius),
    filter(isLiquid),
    toArray(), // Not needed, also forEach possible
);
```
Remark: The operators are created with generator functions, from the outside you don't notice this.

## callbags:
[Callbags](https://github.com/staltz/callbag-basics) is a spec that describes a pattern that works on both iterable and reactive data.

It also uses Lazy Evaluation

```
const liquidDegrees = pipe(
    fromIter(kelvinTemperatures),
    map(kelvinToCelcius),
    filter(isLiquid),
    toArray(), // Not needed, also forEach possible
);
```

## pipeables:
This is a term that doesn't exists, I just invented it to label my test. ;-)

These are just functions that wrap the native array methods and can also be combined with `pipe`, similar as the above solutions.

`pipe` makes it easy to chain functions without the need to modify the prototype of Array.

```
const result = pipe(
    arr,
    map(kelvinToCelcius),
    filter(isLiquid),
);
```

## Remark
- These tests don't use libraries. It just tests the principles.
- There are lots of libraries that use the transducer principle or can operate on Iterables: [lodash](https://lodash.com/), [wu.js](http://fitzgen.github.io/wu.js/), [IxJS](https://github.com/ReactiveX/IxJS), ...
- These tests are a rough indication of the speed. I don't know if/where the garbage collections kicks-in an influences the results.
- Maybe some of my operators don't have the most performant implementation.
- Result differ much on other browsers

## Findings

- When you don't chain a lot of operators, the standard array methods (`filter`, `map`, `some`, ...) perform well. On Chrome they become slow when using more then 50.000 elements.

- The overhead of the 'pipeable' array functions is not noticeable.

- Transducers on Edge are very slow.

- Generators are JavaScript's standard way of processing element-by-element instead of list-per-list but are still quite slow, especially on Firefox en Edge

- Callbags are fast on Edge and Firefox, but slow on Chrome when processing a limited amount of elements: < #100.000. They are powerful tool that also can be used for reactive programming, but quite hard to master.


## My conclusion

It depends on what you do, on how much elements and on which browser.

If you want to use operators (`filter`, `map`, ...), it seems fine to keep using the native **array methods**. 

- They are quite fast (expect on Chrome when using > 50.000 elements)
- every developer understands them
- easy to debug.

If you chain lots of operators or you use the `some` or `every` operator, you can try to replacing them with 1 reduce operator.

If you want lazy evaluation or work with iterators, you need to choose one of these:

**Transducers** are powerful and compose very well but seem to be very slow on Edge.

Using **Generators** is the most 'standard' solution but is still slow, especially on Firefox and Edge.

**Callbags** have a good overall performance on all browsers (expect on Chrome when using < 10.000 elements). If you (and some other team members) understand them and you can write your own operators this could be a powerful way of working.

If:
- performance matters
- you have possibly a large dataset
- you don't care about readability
- you have many chained operators

then nothing can beat a good old dirty `for` loop (`for-of` for iterators)!
