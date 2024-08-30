/**
 *@autor Edson Sosa
 */
import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../config';
import { Client } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, dbName, password, port } = configService.postgres;
        const client = new Client({
          user,
          host,
          database: dbName,
          password,
          port
        });
        client.connect();
        return client;
      },
      inject: [config.KEY]
    }
  ],
  exports: ['PG']
})
export class DatabaseModule {
}
