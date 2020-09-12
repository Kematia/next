#stream of tought to be cleaned up
conceptually blocks are dynamic, non-relational (or one-way relational, as in they pull data/content from relational content but they don't offer it back relationally) pieces of content, that are very specific to the data item they are atteched to: a webpage content, a product rich description, a new article content

they will pull from an admin-defined set of components (we could provide some starter ones). the components could be described by code (custom extensions) or built with an interface similar to the data_model view you use to build collections

in theory a "recursive" block builder could be used

the interface should be as simple as possible, enabling editors to build complex dynamic content types quickly
it should support i18n, without having to duplicate the content (store translation in the deepest part of the data tree?)

it should support inline editing?
