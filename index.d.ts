interface FulfillerIdentityClientOptions {
  AWSXRay?: Function;
  retries?: number;
  retryDelayInMs?: number;
  timeout?: number;
  url?: string;
}

interface BaseOptions {
  noCache?: boolean;
}

interface GetFulfillersOptions extends BaseOptions {
  showArchived?: boolean;
  fulfillerName?: string;
}

interface Fulfiller {
  fulfillerId: string;
  internalFulfillerId: string;
  name: string;
  email: string;
  phone: string;
  language: string;
  setupInProgress: FlagExtended;
  active: FlagExtended;
  idle: FlagExtended;
  inactive: FlagExtended;
  retired: FlagExtended;
  archived: boolean;
  links: FulfillerLinks;
}

interface FlagExtended {
  description?: string;
  value: boolean;
  lastUpdated?: string;
  explicit?: string;
}

interface FulfillerContactExtended {
  id: string;
  createdAt: string;
  createdBy: string;
  businessContact: boolean;
  operationalSupportContact: boolean;
  technicalContact: boolean;
  email: string;
  phone: string;
  role: string;
  name: string;
  language: string;
  defaultContact: boolean;
  links: FulfillerContactLinks;
}

interface FulfillerLinks {
  self: Link;
  fulfillmentLocations?: Link;
  fulfillerCoamAdminGroup?: Link;
  account?: Link;
  fulfillerLogo?: Link;
  fulfillerContacts?: Link;
}

interface FulfillerContactLinks {
  self: Link;
  up: Link;
  fulfiller: Link;
}

interface Link {
  href: string;
  rel?: string;
}

declare class FulfillerIdentityClient {
  constructor(authorization?: (string|(() => string)), clientOptions?: FulfillerIdentityClientOptions);

  getUrl(): string;
  getFulfillers(options: GetFulfillersOptions): Promise<Fulfiller[]>;
  getFulfiller(fulfillerId: string, options: BaseOptions): Promise<Fulfiller>;

  getFulfillerContacts(fufillerId: string, options: BaseOptions): Promise<FulfillerContactExtended[]>

  // Unsure how to type this, please refer to the documentation
  // https://github.com/Cimpress/cimpress-fulfiller-identity
  saveFulfiller(fulfiller: any): Promise<void>;
}

export default FulfillerIdentityClient;
