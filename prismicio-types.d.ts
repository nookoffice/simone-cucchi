import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type HomepageDocumentDataSlicesSlice = HeroSlice

/**
 * Content for Homepage documents
 */
interface HomepageDocumentData {
	/**
	 * Slice Zone field in *Homepage*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<HomepageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 50–60 characters. Shown in search results and the browser tab.
	 * - **API ID Path**: homepage.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 150–160 characters. Shown under the title in search results.
	 * - **API ID Path**: homepage.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Homepage*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Homepage document from Prismic
 *
 * - **API ID**: `homepage`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomepageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomepageDocumentData>, "homepage", Lang>;

type PageDocumentDataSlicesSlice = WorkListSlice | AboutIndexSlice | CaseStudyHeroSlice | PhoneScreensSlice | SectionImageSlice | StatGridSlice | LeadStatementSlice | CreditListSlice | NextProjectSlice

/**
 * Content for Page documents
 */
interface PageDocumentData {
	/**
	 * Slice Zone field in *Page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<PageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 50–60 characters. Shown in search results and the browser tab.
	 * - **API ID Path**: page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 150–160 characters. Shown under the title in search results.
	 * - **API ID Path**: page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Page document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>;

/**
 * Item in *Settings → Header links*
 */
export interface SettingsDocumentDataHeaderLinksItem {
	/**
	 * Label field in *Settings → Header links*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.header_links[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Link field in *Settings → Header links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.header_links[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *Settings → Footer links*
 */
export interface SettingsDocumentDataFooterLinksItem {
	/**
	 * Label field in *Settings → Footer links*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.footer_links[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Link field in *Settings → Footer links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.footer_links[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for Settings documents
 */
interface SettingsDocumentData {
	/**
	 * Meta title field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 50–60 characters. Shown in search results and the browser tab.
	 * - **API ID Path**: settings.meta_title
	 * - **Tab**: SEO
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta description field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 150–160 characters. Shown under the title in search results.
	 * - **API ID Path**: settings.meta_description
	 * - **Tab**: SEO
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * OG image field in *Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.og_image
	 * - **Tab**: SEO
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	og_image: prismic.ImageField<never>;/**
	 * Header links field in *Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.header_links[]
	 * - **Tab**: Navigation
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	header_links: prismic.GroupField<Simplify<SettingsDocumentDataHeaderLinksItem>>;
	
	/**
	 * Footer links field in *Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.footer_links[]
	 * - **Tab**: Navigation
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	footer_links: prismic.GroupField<Simplify<SettingsDocumentDataFooterLinksItem>>;/**
	 * Theme field in *Settings*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: Light, dark, or brand for the whole site.
	 * - **Default Value**: light
	 * - **API ID Path**: settings.theme
	 * - **Tab**: Theme
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	theme: prismic.SelectField<"light" | "dark" | "brand", "filled">;
}

/**
 * Settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<SettingsDocumentData>, "settings", Lang>;

export type AllDocumentTypes = HomepageDocument | PageDocument | SettingsDocument;

/**
 * Primary content in *Hero → Default → Primary*
 */
export interface HeroSliceDefaultPrimary {
	/**
	 * Object field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Default variation for Hero Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceDefault = prismic.SharedSliceVariation<"default", Simplify<HeroSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Hero*
 */
type HeroSliceVariation = HeroSliceDefault

/**
 * Hero Shared Slice
 *
 * - **API ID**: `hero`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSlice = prismic.SharedSlice<"hero", HeroSliceVariation>;

/**
 * Item in *WorkList → Default → Primary → Projects*
 */
export interface WorkListSliceDefaultPrimaryProjectsItem {
	/**
	 * Title field in *WorkList → Default → Primary → Projects*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Project name
	 * - **API ID Path**: work_list.default.primary.projects[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Brand colour field in *WorkList → Default → Primary → Projects*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work_list.default.primary.projects[].accent
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	accent: prismic.ColorField;
	
	/**
	 * Teaser field in *WorkList → Default → Primary → Projects*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work_list.default.primary.projects[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Case study field in *WorkList → Default → Primary → Projects*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work_list.default.primary.projects[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *WorkList → Default → Primary*
 */
export interface WorkListSliceDefaultPrimary {
	/**
	 * Projects field in *WorkList → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work_list.default.primary.projects[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	projects: prismic.GroupField<Simplify<WorkListSliceDefaultPrimaryProjectsItem>>;
}

/**
 * Default variation for WorkList Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type WorkListSliceDefault = prismic.SharedSliceVariation<"default", Simplify<WorkListSliceDefaultPrimary>, never>;

/**
 * Slice variation for *WorkList*
 */
type WorkListSliceVariation = WorkListSliceDefault

/**
 * WorkList Shared Slice
 *
 * - **API ID**: `work_list`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type WorkListSlice = prismic.SharedSlice<"work_list", WorkListSliceVariation>;

/**
 * Item in *AboutIndex → Default → Primary → Experience*
 */
export interface AboutIndexSliceDefaultPrimaryExperienceItem {
	/**
	 * Year field in *AboutIndex → Default → Primary → Experience*
	 */
	year: prismic.KeyTextField;

	/**
	 * Entry field in *AboutIndex → Default → Primary → Experience*
	 */
	entry: prismic.KeyTextField;
}

/**
 * Primary content in *AboutIndex → Default → Primary*
 */
export interface AboutIndexSliceDefaultPrimary {
	/**
	 * Intro field in *AboutIndex → Default → Primary*
	 */
	intro: prismic.RichTextField;

	/**
	 * Experience field in *AboutIndex → Default → Primary*
	 */
	experience: prismic.GroupField<Simplify<AboutIndexSliceDefaultPrimaryExperienceItem>>;
}

/**
 * Default variation for AboutIndex Slice
 */
export type AboutIndexSliceDefault = prismic.SharedSliceVariation<"default", Simplify<AboutIndexSliceDefaultPrimary>, never>;

/**
 * Slice variation for *AboutIndex*
 */
type AboutIndexSliceVariation = AboutIndexSliceDefault

/**
 * AboutIndex Shared Slice
 *
 * - **API ID**: `about_index`
 */
export type AboutIndexSlice = prismic.SharedSlice<"about_index", AboutIndexSliceVariation>;

/**
 * Primary content in *CaseStudyHero → Default → Primary*
 */
export interface CaseStudyHeroSliceDefaultPrimary {
	/**
	 * Title field in *CaseStudyHero → Default → Primary*
	 */
	title: prismic.KeyTextField;

	/**
	 * Discipline field in *CaseStudyHero → Default → Primary*
	 */
	discipline: prismic.KeyTextField;

	/**
	 * Intro field in *CaseStudyHero → Default → Primary*
	 */
	intro: prismic.RichTextField;

	/**
	 * Background field in *CaseStudyHero → Default → Primary*
	 */
	image: prismic.ImageField<never>;

	/**
	 * Background (mobile) field in *CaseStudyHero → Default → Primary*
	 */
	image_mobile: prismic.ImageField<never>;
}

/**
 * Default variation for CaseStudyHero Slice
 */
export type CaseStudyHeroSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CaseStudyHeroSliceDefaultPrimary>, never>;

/**
 * Slice variation for *CaseStudyHero*
 */
type CaseStudyHeroSliceVariation = CaseStudyHeroSliceDefault

/**
 * CaseStudyHero Shared Slice
 *
 * - **API ID**: `case_study_hero`
 */
export type CaseStudyHeroSlice = prismic.SharedSlice<"case_study_hero", CaseStudyHeroSliceVariation>;

/**
 * Item in *PhoneScreens → Default → Primary → Screens*
 */
export interface PhoneScreensSliceDefaultPrimaryScreensItem {
	/**
	 * Screenshot field in *PhoneScreens → Default → Primary → Screens*
	 */
	image: prismic.ImageField<never>;

	/**
	 * Screenshot (mobile) field in *PhoneScreens → Default → Primary → Screens*
	 */
	image_mobile: prismic.ImageField<never>;

	/**
	 * Description field in *PhoneScreens → Default → Primary → Screens*
	 */
	alt: prismic.KeyTextField;

	/**
	 * Raised field in *PhoneScreens → Default → Primary → Screens*
	 */
	raised: prismic.BooleanField;
}

/**
 * Primary content in *PhoneScreens → Default → Primary*
 */
export interface PhoneScreensSliceDefaultPrimary {
	/**
	 * Screens field in *PhoneScreens → Default → Primary*
	 */
	screens: prismic.GroupField<Simplify<PhoneScreensSliceDefaultPrimaryScreensItem>>;
}

/**
 * Default variation for PhoneScreens Slice
 */
export type PhoneScreensSliceDefault = prismic.SharedSliceVariation<"default", Simplify<PhoneScreensSliceDefaultPrimary>, never>;

/**
 * Slice variation for *PhoneScreens*
 */
type PhoneScreensSliceVariation = PhoneScreensSliceDefault

/**
 * PhoneScreens Shared Slice
 *
 * - **API ID**: `phone_screens`
 */
export type PhoneScreensSlice = prismic.SharedSlice<"phone_screens", PhoneScreensSliceVariation>;

/**
 * Primary content in *SectionImage → Default → Primary*
 */
export interface SectionImageSliceDefaultPrimary {
	/**
	 * Eyebrow field in *SectionImage → Default → Primary*
	 */
	eyebrow: prismic.KeyTextField;

	/**
	 * Image field in *SectionImage → Default → Primary*
	 */
	image: prismic.ImageField<never>;

	/**
	 * Image (mobile) field in *SectionImage → Default → Primary*
	 */
	image_mobile: prismic.ImageField<never>;
}

/**
 * Default variation for SectionImage Slice
 */
export type SectionImageSliceDefault = prismic.SharedSliceVariation<"default", Simplify<SectionImageSliceDefaultPrimary>, never>;

/**
 * Slice variation for *SectionImage*
 */
type SectionImageSliceVariation = SectionImageSliceDefault

/**
 * SectionImage Shared Slice
 *
 * - **API ID**: `section_image`
 */
export type SectionImageSlice = prismic.SharedSlice<"section_image", SectionImageSliceVariation>;

/**
 * Item in *StatGrid → Default → Primary → Stats*
 */
export interface StatGridSliceDefaultPrimaryStatsItem {
	/**
	 * Value field in *StatGrid → Default → Primary → Stats*
	 */
	value: prismic.KeyTextField;

	/**
	 * Label field in *StatGrid → Default → Primary → Stats*
	 */
	label: prismic.KeyTextField;
}

/**
 * Primary content in *StatGrid → Default → Primary*
 */
export interface StatGridSliceDefaultPrimary {
	/**
	 * Eyebrow field in *StatGrid → Default → Primary*
	 */
	eyebrow: prismic.KeyTextField;

	/**
	 * Caption field in *StatGrid → Default → Primary*
	 */
	caption: prismic.KeyTextField;

	/**
	 * Stats field in *StatGrid → Default → Primary*
	 */
	stats: prismic.GroupField<Simplify<StatGridSliceDefaultPrimaryStatsItem>>;
}

/**
 * Default variation for StatGrid Slice
 */
export type StatGridSliceDefault = prismic.SharedSliceVariation<"default", Simplify<StatGridSliceDefaultPrimary>, never>;

/**
 * Slice variation for *StatGrid*
 */
type StatGridSliceVariation = StatGridSliceDefault

/**
 * StatGrid Shared Slice
 *
 * - **API ID**: `stat_grid`
 */
export type StatGridSlice = prismic.SharedSlice<"stat_grid", StatGridSliceVariation>;

/**
 * Primary content in *LeadStatement → Default → Primary*
 */
export interface LeadStatementSliceDefaultPrimary {
	/**
	 * Eyebrow field in *LeadStatement → Default → Primary*
	 */
	eyebrow: prismic.KeyTextField;

	/**
	 * Statement field in *LeadStatement → Default → Primary*
	 */
	text: prismic.RichTextField;
}

/**
 * Default variation for LeadStatement Slice
 */
export type LeadStatementSliceDefault = prismic.SharedSliceVariation<"default", Simplify<LeadStatementSliceDefaultPrimary>, never>;

/**
 * Slice variation for *LeadStatement*
 */
type LeadStatementSliceVariation = LeadStatementSliceDefault

/**
 * LeadStatement Shared Slice
 *
 * - **API ID**: `lead_statement`
 */
export type LeadStatementSlice = prismic.SharedSlice<"lead_statement", LeadStatementSliceVariation>;

/**
 * Item in *CreditList → Default → Primary → Credits*
 */
export interface CreditListSliceDefaultPrimaryCreditsItem {
	/**
	 * Role field in *CreditList → Default → Primary → Credits*
	 */
	role: prismic.KeyTextField;

	/**
	 * Name field in *CreditList → Default → Primary → Credits*
	 */
	name: prismic.KeyTextField;
}

/**
 * Primary content in *CreditList → Default → Primary*
 */
export interface CreditListSliceDefaultPrimary {
	/**
	 * Eyebrow field in *CreditList → Default → Primary*
	 */
	eyebrow: prismic.KeyTextField;

	/**
	 * Credits field in *CreditList → Default → Primary*
	 */
	credits: prismic.GroupField<Simplify<CreditListSliceDefaultPrimaryCreditsItem>>;
}

/**
 * Default variation for CreditList Slice
 */
export type CreditListSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CreditListSliceDefaultPrimary>, never>;

/**
 * Slice variation for *CreditList*
 */
type CreditListSliceVariation = CreditListSliceDefault

/**
 * CreditList Shared Slice
 *
 * - **API ID**: `credit_list`
 */
export type CreditListSlice = prismic.SharedSlice<"credit_list", CreditListSliceVariation>;

/**
 * Primary content in *NextProject → Default → Primary*
 */
export interface NextProjectSliceDefaultPrimary {
	/**
	 * Title field in *NextProject → Default → Primary*
	 */
	title: prismic.KeyTextField;

	/**
	 * Subtitle field in *NextProject → Default → Primary*
	 */
	subtitle: prismic.KeyTextField;

	/**
	 * Background field in *NextProject → Default → Primary*
	 */
	image: prismic.ImageField<never>;

	/**
	 * Background (mobile) field in *NextProject → Default → Primary*
	 */
	image_mobile: prismic.ImageField<never>;

	/**
	 * Link field in *NextProject → Default → Primary*
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Default variation for NextProject Slice
 */
export type NextProjectSliceDefault = prismic.SharedSliceVariation<"default", Simplify<NextProjectSliceDefaultPrimary>, never>;

/**
 * Slice variation for *NextProject*
 */
type NextProjectSliceVariation = NextProjectSliceDefault

/**
 * NextProject Shared Slice
 *
 * - **API ID**: `next_project`
 */
export type NextProjectSlice = prismic.SharedSlice<"next_project", NextProjectSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			HomepageDocument,
			HomepageDocumentData,
			HomepageDocumentDataSlicesSlice,
			PageDocument,
			PageDocumentData,
			PageDocumentDataSlicesSlice,
			SettingsDocument,
			SettingsDocumentData,
			SettingsDocumentDataHeaderLinksItem,
			SettingsDocumentDataFooterLinksItem,
			AllDocumentTypes,
			HeroSlice,
			HeroSliceDefaultPrimary,
			HeroSliceVariation,
			HeroSliceDefault,
			WorkListSlice,
			WorkListSliceDefaultPrimaryProjectsItem,
			WorkListSliceDefaultPrimary,
			WorkListSliceVariation,
			WorkListSliceDefault,
			AboutIndexSlice,
			AboutIndexSliceDefaultPrimaryExperienceItem,
			AboutIndexSliceDefaultPrimary,
			AboutIndexSliceVariation,
			AboutIndexSliceDefault,
			CaseStudyHeroSlice,
			CaseStudyHeroSliceDefaultPrimary,
			CaseStudyHeroSliceVariation,
			CaseStudyHeroSliceDefault,
			PhoneScreensSlice,
			PhoneScreensSliceDefaultPrimaryScreensItem,
			PhoneScreensSliceDefaultPrimary,
			PhoneScreensSliceVariation,
			PhoneScreensSliceDefault,
			SectionImageSlice,
			SectionImageSliceDefaultPrimary,
			SectionImageSliceVariation,
			SectionImageSliceDefault,
			StatGridSlice,
			StatGridSliceDefaultPrimaryStatsItem,
			StatGridSliceDefaultPrimary,
			StatGridSliceVariation,
			StatGridSliceDefault,
			LeadStatementSlice,
			LeadStatementSliceDefaultPrimary,
			LeadStatementSliceVariation,
			LeadStatementSliceDefault,
			CreditListSlice,
			CreditListSliceDefaultPrimaryCreditsItem,
			CreditListSliceDefaultPrimary,
			CreditListSliceVariation,
			CreditListSliceDefault,
			NextProjectSlice,
			NextProjectSliceDefaultPrimary,
			NextProjectSliceVariation,
			NextProjectSliceDefault
		}
	}
}