import { ItemTypes } from 'src/types';

export const validateItem = (itemType: ItemTypes, payload: any) => {
  const errors = [];

  if (checkSubscriptionMismatch(payload)) {
    return [...errors, 'Ensure this item is a Subscription or not.'];
  }

  switch (itemType) {
    case 'product':
      return getProduct().filter((prop) => !payload[prop]);
    case 'licence':
      return getLicence().filter((prop) => !payload[prop]);
    case 'service':
      return getService().filter((prop) => !payload[prop]);
    case 'subscription_product':
        return getSubscriptionProduct().filter((prop) => !payload[prop]);
      case 'subscription_licence':
        return getSubscriptionLicence().filter((prop) => !payload[prop]);
      case 'subscription_service':
        return getSubscriptionService().filter((prop) => !payload[prop]);
    default:
      return [...errors, 'Unsupported Item type'];
  }
};

const checkSubscriptionMismatch = ({itemType, hasSubscription, stripeId}): boolean => {
  return (hasSubscription || stripeId) && itemType.indexOf('subscription_');
}

const getProduct = () => getBaseProduct();
const getLicence = () => getBaseProduct();
const getService = () => getBaseProduct();

const getSubscriptionProduct = () => getBaseSubscription();
const getSubscriptionLicence = () => getBaseSubscription();
const getSubscriptionService = () => getBaseSubscription();

const getBaseProduct = () => ['name', 'description', 'amount', 'currency', 'category'];

const getBaseSubscription = () => [
  ...getBaseProduct(),
  ...['interval'],
];
