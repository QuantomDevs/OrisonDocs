import type * as Breadcrumb from 'quantomdocs-core/breadcrumb';
import type * as TOC from 'quantomdocs-core/toc';
import type * as Search from 'quantomdocs-core/search';
import type * as PageTree from 'quantomdocs-core/page-tree';
import type * as MDX from 'quantomdocs-core/mdx-plugins';

export type SortedResult = Search.SortedResult;

export type StructureOptions = MDX.StructureOptions;

export type BreadcrumbItem = Breadcrumb.BreadcrumbItem;

export type ScrollProviderProps = TOC.ScrollProviderProps;
export type AnchorProviderProps = TOC.AnchorProviderProps;

export type TOCItemType = TOC.TOCItemType;

export type PageTreeItem = PageTree.Item;
export type PageTreeFolder = PageTree.Folder;
export type PageTreeRoot = PageTree.Root;
export type PageTreeSeparator = PageTree.Separator;

export type RemarkImageOptions = MDX.RemarkImageOptions;
