export default class SavedContact {
  id: number;
  first_name: ?string;
  last_name: ?string;
  email: ?string;
  country: ?string;
  city: ?string;
  zip_code: ?string;
  street: ?string;
  phone: ?string;
  total_spent: ?number;
  avatar_url: ?string;
  payment_types: ?Array;
  channels: ?Array;
  last_purchase: ?string;
  count_purchases: ?number;
  birthday: ?string;
  country_name: ?string;
  invitation_date: ?string;
  invitation_available: ?boolean;
  registered: ?boolean;
  last_active: ?string;
}