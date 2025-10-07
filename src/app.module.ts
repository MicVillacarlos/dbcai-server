import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionStates, type Connection } from 'mongoose';
// import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { StudentModule } from './modules/student/student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly specify .env file
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_DB_URI');
        const logger = new Logger('MongoDBConnection');

        if (!mongoUri) {
          logger.error('MONGO_DB_URI is not defined in environment variables');
          throw new Error(
            'MONGO_DB_URI is not defined in environment variables',
          );
        }

        logger.log('Attempting to connect to MongoDB...');

        return {
          uri: mongoUri,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          connectionFactory: (connection: Connection) => {
            connection.on('connected', () => {
              logger.log('✅ MongoDB connected successfully');
            });

            connection.on('open', () => {
              logger.log('✅ MongoDB connection opened and ready');
            });

            connection.on('disconnected', () => {
              logger.warn('⚠️ MongoDB disconnected');
            });

            connection.on('error', (error: unknown) => {
              const message =
                error instanceof Error ? error.message : String(error);
              logger.error('❌ MongoDB connection error:', message);
            });

            connection.on('reconnected', () => {
              logger.log('🔄 MongoDB reconnected');
            });

            if (connection.readyState === ConnectionStates.connected) {
              logger.log('✅ MongoDB is already connected');
            }
            return connection;
          },
        };
      },
    }),
    AuthModule,
    StudentModule,
  ],
})
export class AppModule {}
