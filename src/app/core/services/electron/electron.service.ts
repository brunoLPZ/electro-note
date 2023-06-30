import { Injectable } from '@angular/core';

import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { APP_CONFIG } from '../../../../environments/environment';
import * as mongodb from 'mongodb';
import { Db } from 'mongodb';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;
  database!: Db;

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.fs = window.require('fs');
      this.childProcess = window.require('child_process');
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  public async connectDb(): Promise<void> {
    const mongo: typeof mongodb = window.require('mongodb');
    try {
      this.database = (await new mongo.MongoClient(APP_CONFIG.mongoUri).connect()).db('electronote');
      console.log('Connected to database');
    } catch (err) {
      console.error('Cannot connect to database', err);
    }
  }
}
