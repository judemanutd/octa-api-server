export interface IAnalyticsModel {
  agent: IAgent;
  location?: ILocation;
}

export interface IAgent {
  ua?: string;
  browser?: IBrowser;
  engine?: IEngine;
  os?: IOS;
  device?: IDevice;
  cpu?: ICPU;
}

export interface IBrowser {
  name: string;
  version: string;
  major: string;
}

export interface ICPU {
  architecture: string;
}

// tslint:disable-next-line: no-empty-interface
export interface IDevice {}

export interface IEngine {
  name: string;
}

export interface IOS {
  name: string;
  version: string;
}

export interface ILocation {
  ip: string;
  type: string;
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip: string;
  latitude: number;
  longitude: number;
  location: IGeoLocation;
}

export interface IGeoLocation {
  geoname_id: number;
  capital: string;
  languages: ILanguage[];
  country_flag: string;
  country_flag_emoji: string;
  country_flag_emoji_unicode: string;
  calling_code: string;
  is_eu: boolean;
}

export interface ILanguage {
  code: string;
  name: string;
  native: string;
}
