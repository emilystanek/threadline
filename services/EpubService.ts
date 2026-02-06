import ePub from "epubjs";

export async function loadBook(uri: string) {
  const book = ePub(uri);
  await book.ready;
  return book;
}