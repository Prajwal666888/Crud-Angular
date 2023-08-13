import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CrudserviceService } from '../crudservice.service';
import { Employee } from './employee';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  constructor(private crud: CrudserviceService) { }
  flag: number = 1;
  employees: any;
  isDisabled: boolean = true;
  retri: any;
  count: number = 0;
  appResp:string='';
  employee: Employee = new Employee;
  emp: any = { name: '', age: NaN, salary: NaN };
  perpage:number=4;
  cc:number=0;
 
  employ:FormGroup=new FormGroup({
    id:new FormControl(),
    name:new FormControl('',[Validators.required,Validators.maxLength(20),Validators.minLength(4)]),
    age:new FormControl('',[Validators.required,Validators.pattern("^[0-9]+$")]),
    salary:new FormControl('',[Validators.required,Validators.pattern("^[0-9]+$")])    
  });

  ngOnInit(): void {
    this.getEmployeesData();
  }

  get name(){
    return this.employ.get('name');
  }

  get em(){
    return this.employ.controls;
  }


  public getEmployeesData() {
    console.log('Inside getEmployees')
    this.crud.getEmployees().subscribe({
      next:(data:any)=>{
        this.employees=data;
      },
      error:(err:HttpErrorResponse)=>{
        if(err.status==0){
          this.appResp='Unable to reach the backend server.';
          alert(this.appResp);
        }
        else 
          this.appResp=err.message;  
      },
      complete: ()=>console.log()
    });
  }

  public getEmployee(id: number) {
    console.log(typeof (id));
    console.log(id);
    this.crud.getEmployee(id).subscribe({
      next: (data: Employee) => {
        console.log(data);
        this.employee = data;
        this.flag = 2;
        console.log(JSON.stringify(this.employee) + ' is the employee');
      }, error: (e) => console.log(e)
    })

  }

  public onSubmit(form: any) {
    console.log(form.id)
    this.crud.putEmployee(form, form.id).subscribe(data => {
      console.log(data);
      this.flag = 1;
      this.ngOnInit();
    });
  }

  public deleteEmployee(id: number) {
    console.log(id);
    this.crud.deleteEmployee(id).subscribe(data => {
      console.log(data);
      this.ngOnInit();
    });
  }

  public disp() {
    this.flag = 3;
  }
  public addEmployee(form: any) {
    // this.emp=form;
    // this.emp.age=parseInt(this.emp.age as unknown as string);
    // this.emp.salary=parseInt(this.emp.salary as unknown as string );
    //  let d:any=this.emp; 
    this.crud.addEmployee(form).subscribe(res => {
      console.log(res);
      this.flag = 1;
      this.ngOnInit();
    })
  }

  public back() {
    this.flag=1;
    this.getEmployeesData();  
  }

  public retr() {
    this.flag = 4;
    this.crud.retriveEmployee().subscribe(data => {
      this.retri = data;
    })
  }

  public counter() {
    this.flag = 5;
  }
  counts(data: string) {
    if (data === 'inc')
      this.count++;
    else if (data === 'dec')
      this.count--;
    else if (data === 'res')
      this.count = 0;
  }

  getSorted(){
    this.flag=6;
    this.crud.getSortedEmployeeData(this.cc).subscribe({
      next:(resp)=>{
        this.employees=resp;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  getSortData(){
    // this.flag=7;
    this.crud.getSortedData().subscribe({
      next :(resp)=>{
        console.log(resp);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  
  eventBind(event:any){
    console.log(event.target.value);
  }
}


