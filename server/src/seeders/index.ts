import devSeeder from './development';
import prodSeeder from './production';

export default (process.env.NODE_ENV !== 'production' ? devSeeder : prodSeeder);
