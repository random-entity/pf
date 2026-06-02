// Remark plugin: group consecutive image paragraphs into a horizontal-scroll
// gallery.  A "run" of 2+ sibling paragraphs whose first child is an image
// node is replaced with:
//   div.gallery > div.gallery-item* (each item keeps the original paragraph's
//   children — image + optional soft-break + optional caption emphasis)
// Single image paragraphs are left untouched (full-width layout).
export function remarkGallery() {
  return (tree) => {
    processChildren(tree)
  }
}

function isImageParagraph(node) {
  return (
    node.type === 'paragraph' &&
    node.children?.length > 0 &&
    node.children[0].type === 'image'
  )
}

function processChildren(parent) {
  if (!parent.children) return

  const next = []
  let i = 0
  while (i < parent.children.length) {
    const node = parent.children[i]

    if (isImageParagraph(node)) {
      // Collect the full consecutive run.
      const run = [node]
      while (
        i + 1 < parent.children.length &&
        isImageParagraph(parent.children[i + 1])
      ) {
        run.push(parent.children[++i])
      }

      if (run.length >= 2) {
        // Wrap in a gallery container, each paragraph becomes a gallery item.
        next.push({
          type: 'gallery',
          data: {
            hName: 'div',
            hProperties: { className: ['gallery'] },
          },
          children: run.map((p) => ({
            type: 'galleryItem',
            data: {
              hName: 'div',
              hProperties: { className: ['gallery-item'] },
            },
            children: p.children,
          })),
        })
      } else {
        // Single image — leave as-is (full-width).
        next.push(run[0])
      }
    } else {
      // Recurse so images inside blockquotes/lists are also handled.
      processChildren(node)
      next.push(node)
    }

    i++
  }

  parent.children = next
}
