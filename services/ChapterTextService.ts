
// Responsible for safely collecting text ONLY from read chapters.

export async function getAllowedText(
  book: any,
  chaptersRead: Set<number>
): Promise<string> {
  const spine = book.spine.spineItems;

  let allowedText = "";

  for (let i = 0; i < spine.length; i++) {
    if (!chaptersRead.has(i)) continue;

    const section = await spine[i].load(book.load.bind(book));
    const text = section.document.body.textContent || "";

    allowedText += `
Chapter ${i + 1}
${text}`;

    section.unload();
  }

  return allowedText;
}