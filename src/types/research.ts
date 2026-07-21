type ResearchLinkType = 'external' | 'file';

export interface ResearchWorkLink {
  label: string;
  url: string;
  type?: ResearchLinkType;
}

export interface ResearchWork {
  title: string;
  year: string;
  category: string;
  summary: string;
  tags: string[];
  links: ResearchWorkLink[];
}
