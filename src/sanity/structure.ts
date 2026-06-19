import type { StructureResolver } from "sanity/structure";

export const SINGLETON_TYPES = new Set(["siteSettings", "homePage", "worksPage"]);

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Works Page")
        .id("worksPage")
        .child(S.document().schemaType("worksPage").documentId("worksPage")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.has(listItem.getId() ?? "")
      ),
    ]);
