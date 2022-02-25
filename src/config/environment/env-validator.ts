import { IsEnum, IsNotEmpty, IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { NodeEnvEnum } from '../constant';

/**
 * ①
 * バリデーションしたい環境変数がある場合はここに記載してください。
 * バリデーションに失敗するとアプリケーションは起動しません。
 */
export class EnvValidator {
  @IsEnum(NodeEnvEnum)
  NODE_ENV: NodeEnvEnum;
  @IsNotEmpty()
  @IsString()
  SLACK_BOT_TOKEN: string;
  @IsNotEmpty()
  @IsString()
  SLACK_APP_TOKEN: string;
  @IsNotEmpty()
  @IsString()
  SLACK_SIGNING_SECRET: string;
  @IsNotEmpty()
  @IsString()
  SLACK_CHANNEL_NAME: string;
}

/**
 * ②
 * @param config バリデーション対象の Record<string, any>。今回は .env.development.local と 環境変数が合体したもの
 * @returns バリデーション済の Record<string, any>
 */
export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvValidator, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) throw new Error(errors.toString());
  return validatedConfig;
};
