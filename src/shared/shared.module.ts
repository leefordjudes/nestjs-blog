import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { SharedService } from './shared.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      connectionName: 'blog',
      useFactory: async (config: ConfigService) => {
        const user = config.get('DB_USER');
        const pass = config.get('DB_PASS');
        const host = config.get('DB_HOST');
        const name = config.get('DB_NAME');
        return {
          //uri: `mongodb+srv://${user}:${pass}@${host}/${name}?retryWrites=true&w=majority`,
          uri: `mongodb://127.0.0.1:27017/${name}`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SharedService],
  exports: [SharedService]
})
export class SharedModule {}
