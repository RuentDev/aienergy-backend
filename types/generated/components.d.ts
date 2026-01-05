import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsAddress extends Struct.ComponentSchema {
  collectionName: 'components_elements_addresses';
  info: {
    description: '';
    displayName: 'Address';
    icon: 'bulletList';
  };
  attributes: {
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    isActive: Schema.Attribute.Boolean;
    phone: Schema.Attribute.String;
    postcode: Schema.Attribute.String;
    state_territory: Schema.Attribute.String;
    street: Schema.Attribute.String;
    suburb: Schema.Attribute.String;
  };
}

export interface ElementsCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_cards';
  info: {
    description: '';
    displayName: 'Card';
  };
  attributes: {
    brand: Schema.Attribute.String;
    expMonth: Schema.Attribute.String;
    expYear: Schema.Attribute.String;
    last4Char: Schema.Attribute.String;
    stripePaymentMethodId: Schema.Attribute.String;
  };
}

export interface ElementsCartItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_cart_items';
  info: {
    description: '';
    displayName: 'Cart Item';
    icon: 'bulletList';
  };
  attributes: {
    image: Schema.Attribute.String & Schema.Attribute.Required;
    model: Schema.Attribute.String & Schema.Attribute.Required;
    odoo_product_id: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    productID: Schema.Attribute.String & Schema.Attribute.Required;
    quantity: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsDeliveryOption extends Struct.ComponentSchema {
  collectionName: 'components_elements_delivery_options';
  info: {
    description: '';
    displayName: 'Shipping Option';
  };
  attributes: {
    calculation: Schema.Attribute.String;
    insideMetro: Schema.Attribute.Boolean;
    packageSize: Schema.Attribute.String;
    price: Schema.Attribute.Integer;
  };
}

export interface ElementsFilterRule extends Struct.ComponentSchema {
  collectionName: 'components_elements_filter_rules';
  info: {
    description: '';
    displayName: 'Filter';
  };
  attributes: {
    handle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsInput extends Struct.ComponentSchema {
  collectionName: 'components_elements_inputs';
  info: {
    displayName: 'Input';
  };
  attributes: {
    label: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean;
    type: Schema.Attribute.Enumeration<['TEXT', 'NUMBER', 'TEXTAREA']>;
  };
}

export interface ElementsInventory extends Struct.ComponentSchema {
  collectionName: 'components_elements_inventories';
  info: {
    description: '';
    displayName: 'Inventory';
    icon: 'bulletList';
  };
  attributes: {
    brisbane: Schema.Attribute.BigInteger;
    melbourne: Schema.Attribute.BigInteger;
    sydney: Schema.Attribute.BigInteger;
  };
}

export interface ElementsIsEmailSent extends Struct.ComponentSchema {
  collectionName: 'components_elements_is_email_sents';
  info: {
    displayName: 'IsEmailSent';
  };
  attributes: {
    orderCancelled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    orderConfirmed: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    orderReadyforPickup: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    orderShipped: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ElementsKeyFeatures extends Struct.ComponentSchema {
  collectionName: 'components_elements_key_features';
  info: {
    displayName: 'key_features';
  };
  attributes: {
    feature: Schema.Attribute.String;
  };
}

export interface ElementsLineItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_line_items';
  info: {
    description: '';
    displayName: 'Line Item';
  };
  attributes: {
    line: Schema.Attribute.Component<'elements.cart-item', false>;
  };
}

export interface ElementsName extends Struct.ComponentSchema {
  collectionName: 'components_elements_names';
  info: {
    displayName: 'Name';
  };
  attributes: {
    first_name: Schema.Attribute.String;
    last_name: Schema.Attribute.String;
    middle_name: Schema.Attribute.String;
  };
}

export interface ElementsPaymentOption extends Struct.ComponentSchema {
  collectionName: 'components_elements_payment_options';
  info: {
    displayName: 'Payment Option';
  };
  attributes: {
    billing_zip: Schema.Attribute.String;
    card_holder_name: Schema.Attribute.String;
    card_number: Schema.Attribute.String;
    cvv: Schema.Attribute.String;
    expiration_date: Schema.Attribute.Date;
  };
}

export interface ElementsPickupOption extends Struct.ComponentSchema {
  collectionName: 'components_elements_pickup_options';
  info: {
    description: '';
    displayName: 'Pickup Option';
  };
  attributes: {
    date: Schema.Attribute.DateTime;
    estimatedArrivalTime: Schema.Attribute.String;
    startTime: Schema.Attribute.Time;
    timeRange: Schema.Attribute.String;
  };
}

export interface ElementsPrice extends Struct.ComponentSchema {
  collectionName: 'components_elements_prices';
  info: {
    description: '';
    displayName: 'Price';
    icon: 'priceTag';
  };
  attributes: {
    max_quantity: Schema.Attribute.BigInteger;
    min_quantity: Schema.Attribute.BigInteger;
    price: Schema.Attribute.Decimal;
    sale_price: Schema.Attribute.Decimal;
    user_level: Schema.Attribute.Enumeration<
      ['SMALL', 'MID-SIZED', 'VIP', 'WHOLESALE']
    >;
  };
}

export interface ElementsProductCategory extends Struct.ComponentSchema {
  collectionName: 'components_elements_product_categories';
  info: {
    displayName: 'Product Category';
    icon: 'bulletList';
  };
  attributes: {
    custom_icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heading: Schema.Attribute.String;
    icon_name: Schema.Attribute.String;
    slug: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface ElementsShippingAddress extends Struct.ComponentSchema {
  collectionName: 'components_elements_shipping_addresses';
  info: {
    description: '';
    displayName: 'Shipping Address';
    icon: 'bulletList';
  };
  attributes: {
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    odoo_address_id: Schema.Attribute.String;
    postcode: Schema.Attribute.String;
    state: Schema.Attribute.String;
    street1: Schema.Attribute.String;
    street2: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsSpecification extends Struct.ComponentSchema {
  collectionName: 'components_elements_specifications';
  info: {
    description: '';
    displayName: 'Specification';
    icon: 'bulletList';
  };
  attributes: {
    key: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsSpecs extends Struct.ComponentSchema {
  collectionName: 'components_elements_specs';
  info: {
    displayName: 'Specs';
  };
  attributes: {
    key: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsStoreFeature extends Struct.ComponentSchema {
  collectionName: 'components_elements_store_features';
  info: {
    displayName: 'Store Feature';
    icon: 'bulletList';
  };
  attributes: {
    custom_icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heading: Schema.Attribute.String;
    icon_name: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface ElementsTotal extends Struct.ComponentSchema {
  collectionName: 'components_elements_totals';
  info: {
    description: '';
    displayName: 'Total';
  };
  attributes: {
    cardSurcharge: Schema.Attribute.Decimal;
    currency: Schema.Attribute.String;
    deliveryFee: Schema.Attribute.Decimal;
    gst: Schema.Attribute.Decimal;
    subtotal: Schema.Attribute.Decimal;
    total: Schema.Attribute.Decimal;
  };
}

export interface ElementsWarehouseAddress extends Struct.ComponentSchema {
  collectionName: 'components_elements_warehouse_addresses';
  info: {
    displayName: 'Warehouse Address';
    icon: 'bulletList';
  };
  attributes: {
    city: Schema.Attribute.String;
    postcode: Schema.Attribute.String;
    state: Schema.Attribute.String;
    street: Schema.Attribute.String;
    suburb: Schema.Attribute.String;
    unit: Schema.Attribute.String;
  };
}

export interface ElementsWarehouseLocation extends Struct.ComponentSchema {
  collectionName: 'components_elements_warehouse_locations';
  info: {
    description: '';
    displayName: 'Warehouse Location';
    icon: 'bulletList';
  };
  attributes: {
    address: Schema.Attribute.Component<'elements.warehouse-address', false>;
    name: Schema.Attribute.String;
    odoo_warehouse_id: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface FormInquiry extends Struct.ComponentSchema {
  collectionName: 'components_form_inquiries';
  info: {
    displayName: 'Inquiry';
    icon: 'apps';
  };
  attributes: {
    button_title: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    inputs: Schema.Attribute.Component<'elements.input', true>;
  };
}

export interface FormNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_form_newsletters';
  info: {
    description: '';
    displayName: 'Newsletter';
    icon: 'envelop';
  };
  attributes: {
    button_title: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    inputs: Schema.Attribute.Component<'elements.input', true>;
    sub_heading: Schema.Attribute.String;
    sub_text: Schema.Attribute.String;
  };
}

export interface LayoutSlide extends Struct.ComponentSchema {
  collectionName: 'components_layout_slides';
  info: {
    description: '';
    displayName: 'Slide';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['DESKTOP', 'TABLET', 'MOBILE']>;
  };
}

export interface LayoutWarehouseLocation extends Struct.ComponentSchema {
  collectionName: 'components_layout_warehouse_locations';
  info: {
    description: '';
    displayName: 'Warehouse Location';
    icon: 'bulletList';
  };
  attributes: {
    address: Schema.Attribute.String;
    google_maps_link: Schema.Attribute.Text;
    name: Schema.Attribute.String;
    office_time: Schema.Attribute.String;
    warehouse_time: Schema.Attribute.String;
  };
}

export interface SectionsAbout extends Struct.ComponentSchema {
  collectionName: 'components_sections_about';
  info: {
    description: '';
    displayName: 'About';
  };
  attributes: {
    background_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    button_title: Schema.Attribute.String;
    description: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface SectionsCategoryButtonSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_category_button_sections';
  info: {
    displayName: 'Category Button Section';
    icon: 'bulletList';
  };
  attributes: {
    categories: Schema.Attribute.Component<'elements.product-category', true>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface SectionsContactDetails extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_details';
  info: {
    description: '';
    displayName: 'Contact Details';
  };
  attributes: {
    left_heading: Schema.Attribute.String;
    left_sub_heading: Schema.Attribute.String;
    right_heading: Schema.Attribute.String;
    right_sub_heading: Schema.Attribute.String;
  };
}

export interface SectionsContactUs extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_us';
  info: {
    description: '';
    displayName: 'Contact Us';
  };
  attributes: {
    background_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    button_title: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
  };
}

export interface SectionsFeaturedProducts extends Struct.ComponentSchema {
  collectionName: 'components_sections_featured_products';
  info: {
    displayName: 'Featured Products';
    icon: 'briefcase';
  };
  attributes: {
    heading: Schema.Attribute.String;
    slug: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface SectionsImageSlider extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_sliders';
  info: {
    description: '';
    displayName: 'Image Slider';
    icon: 'apps';
  };
  attributes: {
    animation_duration: Schema.Attribute.Integer;
    display_button: Schema.Attribute.Boolean;
    slides: Schema.Attribute.Component<'layout.slide', true>;
  };
}

export interface SectionsStoreFeatureGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_store_feature_grids';
  info: {
    displayName: 'Store Feature Grid';
    icon: 'apps';
  };
  attributes: {
    features: Schema.Attribute.Component<'elements.store-feature', true>;
  };
}

export interface SectionsWarehouseLocations extends Struct.ComponentSchema {
  collectionName: 'components_sections_warehouse_locations';
  info: {
    displayName: 'Warehouse Locations';
  };
  attributes: {
    heading: Schema.Attribute.String;
    locations: Schema.Attribute.Component<'layout.warehouse-location', true>;
    sub_heading: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.address': ElementsAddress;
      'elements.card': ElementsCard;
      'elements.cart-item': ElementsCartItem;
      'elements.delivery-option': ElementsDeliveryOption;
      'elements.filter-rule': ElementsFilterRule;
      'elements.input': ElementsInput;
      'elements.inventory': ElementsInventory;
      'elements.is-email-sent': ElementsIsEmailSent;
      'elements.key-features': ElementsKeyFeatures;
      'elements.line-item': ElementsLineItem;
      'elements.name': ElementsName;
      'elements.payment-option': ElementsPaymentOption;
      'elements.pickup-option': ElementsPickupOption;
      'elements.price': ElementsPrice;
      'elements.product-category': ElementsProductCategory;
      'elements.shipping-address': ElementsShippingAddress;
      'elements.specification': ElementsSpecification;
      'elements.specs': ElementsSpecs;
      'elements.store-feature': ElementsStoreFeature;
      'elements.total': ElementsTotal;
      'elements.warehouse-address': ElementsWarehouseAddress;
      'elements.warehouse-location': ElementsWarehouseLocation;
      'form.inquiry': FormInquiry;
      'form.newsletter': FormNewsletter;
      'layout.slide': LayoutSlide;
      'layout.warehouse-location': LayoutWarehouseLocation;
      'sections.about': SectionsAbout;
      'sections.category-button-section': SectionsCategoryButtonSection;
      'sections.contact-details': SectionsContactDetails;
      'sections.contact-us': SectionsContactUs;
      'sections.featured-products': SectionsFeaturedProducts;
      'sections.image-slider': SectionsImageSlider;
      'sections.store-feature-grid': SectionsStoreFeatureGrid;
      'sections.warehouse-locations': SectionsWarehouseLocations;
    }
  }
}
