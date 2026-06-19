import { type SchemaTypeDefinition } from "sanity";

import { plateType } from "./objects/plate";
import { factType } from "./objects/fact";
import { serviceItemType } from "./objects/serviceItem";

import { caseStudyHeroType } from "./blocks/caseStudyHero";
import { fullBleedImageType } from "./blocks/fullBleedImage";
import { overviewBlockType } from "./blocks/overviewBlock";
import { beforeAfterBlockType } from "./blocks/beforeAfterBlock";
import { twoUpImageBlockType } from "./blocks/twoUpImageBlock";
import { quotePortraitBlockType } from "./blocks/quotePortraitBlock";
import { textImageBlockType } from "./blocks/textImageBlock";
import { creditsBlockType } from "./blocks/creditsBlock";

import { projectType } from "./documents/project";
import { homePageType } from "./documents/homePage";
import { worksPageType } from "./documents/worksPage";
import { siteSettingsType } from "./documents/siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    projectType,
    homePageType,
    worksPageType,
    siteSettingsType,
    // objects
    plateType,
    factType,
    serviceItemType,
    // blocks
    caseStudyHeroType,
    fullBleedImageType,
    overviewBlockType,
    beforeAfterBlockType,
    twoUpImageBlockType,
    quotePortraitBlockType,
    textImageBlockType,
    creditsBlockType,
  ],
};
