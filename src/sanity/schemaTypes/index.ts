import { type SchemaTypeDefinition } from "sanity";

import { plateType } from "./objects/plate";
import { pdfPlateType } from "./objects/pdfPlate";
import { factType } from "./objects/fact";
import { serviceItemType } from "./objects/serviceItem";
import { titleLineType } from "./objects/titleLine";

import { caseStudyHeroType } from "./blocks/caseStudyHero";
import { fullBleedImageType } from "./blocks/fullBleedImage";
import { overviewBlockType } from "./blocks/overviewBlock";
import { beforeAfterBlockType } from "./blocks/beforeAfterBlock";
import { twoUpImageBlockType } from "./blocks/twoUpImageBlock";
import { quotePortraitBlockType } from "./blocks/quotePortraitBlock";
import { textImageBlockType } from "./blocks/textImageBlock";
import { creditsBlockType } from "./blocks/creditsBlock";
import { plansBlockType } from "./blocks/plansBlock";
import { materialsBlockType, materialItemType } from "./blocks/materialsBlock";
import { furnitureBlockType, furniturePieceType } from "./blocks/furnitureBlock";

import { projectType } from "./documents/project";
import { homePageType } from "./documents/homePage";
import { worksPageType } from "./documents/worksPage";
import { siteSettingsType } from "./documents/siteSettings";
import { guestAccessType } from "./documents/guestAccess";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    projectType,
    homePageType,
    worksPageType,
    siteSettingsType,
    guestAccessType,
    // objects
    plateType,
    pdfPlateType,
    factType,
    serviceItemType,
    titleLineType,
    materialItemType,
    furniturePieceType,
    // blocks
    caseStudyHeroType,
    fullBleedImageType,
    overviewBlockType,
    beforeAfterBlockType,
    twoUpImageBlockType,
    quotePortraitBlockType,
    textImageBlockType,
    creditsBlockType,
    plansBlockType,
    materialsBlockType,
    furnitureBlockType,
  ],
};
