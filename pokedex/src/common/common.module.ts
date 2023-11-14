import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
    // Adapters
    providers: [AxiosAdapter],
    exports: [AxiosAdapter]
})
export class CommonModule { }
