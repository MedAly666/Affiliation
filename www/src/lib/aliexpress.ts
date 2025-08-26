import AliexpressApiService from 'aliexpress-api';
import { ALIEXPRESS_APP_KEY, ALIEXPRESS_PID, ALIEXPRESS_APP_SECRET } from '$env/static/private';

// Initialize the service with your credentials
const aliexpress = new AliexpressApiService(
  ALIEXPRESS_APP_KEY,
  ALIEXPRESS_APP_SECRET,
  null,
  ALIEXPRESS_PID
);

export default aliexpress;