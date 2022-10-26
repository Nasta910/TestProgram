import { Component, OnInit } from '@angular/core';

import { Pop } from '../pop';
import { PopService } from '../pop.service';

@Component({
  selector: 'app-pops',
  templateUrl: './pops.component.html',
  styleUrls: ['./pops.component.css'],
})
export class PopsComponent implements OnInit {
  pops: Pop[] = [];

  constructor(private popService: PopService) {}

  ngOnInit(): void {
    this.getPops();
  }

  getPops(): void {
    this.popService.getPops().subscribe((pops) => (this.pops = pops));
  }

  add(
    popName: string,
    popNumber: number,
    popPrice: number,
    popShipping: number,
    popSold: boolean,
    popDelivered: boolean,
    popCollection: number,
    popStore: number,
    popImage: string,
    popOrderDate: string
  ): void {
    if (!popName) {
      return;
    }
    this.popService
      .addPop({
        popName,
        popNumber,
        popPrice,
        popShipping,
        popSold,
        popDelivered,
        popCollection,
        popStore,
        popImage,
        popOrderDate,
      } as unknown as Pop)
      .subscribe((pop) => {
        this.pops.push(pop);
      });
  }

  delete(pop: Pop): void {
    this.pops = this.pops.filter((h) => h !== pop);
    this.popService.deletePop(pop.popid).subscribe();
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
