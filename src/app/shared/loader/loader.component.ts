import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vex-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  constructor() { }

  ngOnInit(): void {
  }

}
