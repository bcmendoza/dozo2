import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {
  
  project = { title:'', description:'', notes:'', startDate:'', targetDate:'', contributor_ids:'' };
  action = 'Create Project';
  users;
  
  constructor(
    private dialog: MatDialogRef<NewProjectComponent>,
    private snackbar: MatSnackBar,
    private _ps: ProjectService,
    private _us: UserService
  ) { }

  ngOnInit(){
    this.users = this._us.list();
    
  }
  
  createProject(project){
    this._ps.create(project)
    .subscribe(result => {
      this.snackbar.open(result['msg'], 'x', {duration: 3000});
      if(result['status']) {
        this.dialog.close(true);
      }
    });
  }

}
