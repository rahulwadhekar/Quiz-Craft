import { GlobalWorkerOptions } from 'pdfjs-dist';
import workerPath from 'pdfjs-dist/build/pdf.worker.entry';

GlobalWorkerOptions.workerSrc = workerPath;
