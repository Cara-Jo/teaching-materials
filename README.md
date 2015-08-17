# DataStax Curriculum

## Getting Started

If you want an introduction on the architecture and underlying technology stack of DataStax curriculum, [watch this video](https://academy.datastax.com/demos/how-curriculum-datastax) on DataStax Academy. If this README says anything different from the video, believe the README.

## ~~Steal~~ Clone This Repo

All official DataStax curriculum is contained in this repo. The build system depends on several other repositories, some of which are maintained by us and some of which are open source. To get them all, do the following:

```
$ git clone git@github.com:datastax-training/curriculum
$ cd curriculum
$ git submodule update --init --recursive
```

### Install Gradle Globally (Mac OS X)

If you don't have Homebrew installed, [http://brew.sh/](install it).

Once you have Homebrew installed you can install Gradle globally:

```bash
$ brew install gradle
```

### Install Gradle Globally (Windows)

* [Download Gradle](http://gradle.org/gradle-download/)
* Unzip it to some place that makes you happy
* Put `%THAT_HAPPY_PATH%\bin` in your `PATH`
* Profit?
* **NB**: Anyone can build and use this curriculum on Mac, Windows, or Linux. However, active participation in curriculum development works best on a Mac.


> Note: Gradle functionality depends on Java 8 being installed & available. Ensure that your environment is pointing to Java 8 tools (e.g., ``$JAVA_HOME``).


## Building a Vertex

Since this is modular build, each vertex has its own directory, artifacts, and build file. The outputs of that build go into their own `build` directory within the vertex directory.

To build slides, you must first navigate to the vertex you would like to build.

Example:
```bash
$ cd example/vertex
```

From inside that directory, you can build all the vertex content with a single build target:

```bash
$ gradle clean vertex
```

After the build has succeeded slides will be available in the vertex's build directory located at: `build/asciidoc/deckjs/slides.html`. Open `slides.html` in your web browser for great justice.

## Slide Setup

After you've taken a look at some slides, you might even want to make some of your own. If you're like us, you'll want to copy something that's already working and change it. You can use the [example vertex](https://github.com/datastax-training/curriculum/tree/master/examples/vertex) for this purpose.

As you can see, the `slides.adoc` file has these attributes at the top of the file:

```asciidoc
= Title
Author(s)
:backend: deckjs
:deckjs_theme: datastax
:deckjs_transition: fade
:navigation:
:status:
:notes:
:split:

:slide_path: slides
:image_path: images
include::includes.adoc[]
```

_*Note:* The line breaks should be exactly as shown in this block._

It also includes a file called `includes.adoc`. This may seem like a gratuitous bit of indirection, but for now just trust us that you should make your vertex look just like this. It's up to you whether all your slide content goes in `includes.adoc`, or if you want to break slides into individual files like the example shows.

A vertex also includes these resources:
* `src/objectives.adoc`: A bulleted list of the things you want the learner to able to accomplish when you are all done with him or her.
* `src/exercises.adoc`: An optional sequence of things the learner can do to apply or demonstrate all that new knowledge you dropped.
* `images/`: Where you put the images you want in your slides. All diagrams should be in SVG format. (JPGs are certainly allowed when appropriate!) See the example slides for details on how to include images in Asciidoc.

## Presenter Mode

Presenter mode includes a cloned window that will progress through the slides at the same time as the parent slide. The cloned window will also contain the presenter notes that will only be visible to the presenter.

Do not mirror your displays if you do not want the presenter notes to be displayed on the main screen for the students to see.

1. Clone the current tab that contains the slides by typing `c`.
2. Place this window on whichever screen you'd like to see the notes on.
3. View the notes of any slide by typing `n`. This will bring up an overlay that contains the slide notes. Not all slides will have notes associated with them.

## Formatting Asciidoc

You can visit the [complete Asciidoc reference](http://asciidoctor.org/docs/asciidoc-syntax-quick-reference/) for details, but here's the stuff you really need to know:

### General text formatting
```asciidoc
_italic phrase_

__i__talic le__tt__ers

*bold phrase*

**b**old le**tt**ers

*_bold italic phrase_*

**__b__**old italic le**__tt__**ers

`monospace phrase` and le``tt``ers

`_monospace italic phrase_` and le``__tt__``ers

`*monospace bold phrase*` and le``**tt**``ers

`*_monospace bold italic phrase_*` and le``**__tt__**``ers
```

### Notes
To add notes to any slide insert the following code after the content of the slide.
```asciidoc
[.notes]
This is a single line of notes.
```

```asciidoc
[.notes]
--
This set of notes contains lists and that's pretty neat.

* list item
* list item
--
```

_note the `--` at the beginning and end of note block_

### Image alignment
To align images add an additional attribute to the image.

Center:
```
image::{image_path}/import-data-modeling.svg[role="center"]
```

Right:
```
image::{image_path}/import-data-modeling.svg[role="right"]
```

Left:
```
image::{image_path}/import-data-modeling.svg[role="left"]
```

### Transition Slides

![](https://cloud.githubusercontent.com/assets/180763/7872880/f3f6383e-0558-11e5-9ab6-a9081bd83066.jpg)

When you want to transition to a different vertex or section of the presentation you can use transitional slides that will be
themed differently. Currently there are 4 color themes: `[role="transition-blue"]`, `[role="transition-green"]`, `[role="transition-orange"]`, & `[role="transition-purple"]`.

Before the slide title include:
```
[role="transition-blue"]
== Slide title
```





### Limit content of slide to a minimum
Putting too much content in a single slide will cause the presentation to scale the content to fit on the page. This is not ideal since the text will be too small for students to read.

To avoid this use the split syntax on slides to split the content of that slide over multiple slides.
```asciidoc
== This Slide is Split

This Slide will act like

<<<

three individual slides with the same title

<<<

once the document is rendered.
```


```asciidoc
[options="step"]
* These bullets
* Will step
* As the presenter clicks forward
```

The following block formats like SQL which is good enough for our CQL code:

```asciidoc
[source,sql]
SELECT *
FROM users;
```

Block Comments: At least four forward slashes. Use the same number of slashes at the end of the readme.
