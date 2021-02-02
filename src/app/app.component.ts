import { Component } from '@angular/core';
import { AbstractControl, FormControl} from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../app/email.service' 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private formBuilder: FormBuilder , private emailService : EmailService ) { }

  profileForm: FormGroup;
  title = 'forms';
  unique = false;
  submitted = false;
  imageUrl;
  ngOnInit() {
    this.profileForm = this.formBuilder.group({
    name : new FormControl('', [Validators.required , Validators.pattern('[a-zA-Z]+')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required ,this.ValidateMobile]),
    img: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, this.Validatepassword]),
    confirmPassword: new FormControl('', [Validators.required]),
    },
    { 
      validators: this.checkPasswords 
    });
  }
  onSubmit(){
    this.submitted = true;
    let email = this.profileForm.value.email;
    if(!this.emailService.valid(email)){
      this.unique = true;
      if(this.profileForm.valid){
        console.log("submitted Successfuly");
      }
    } else {
      this.unique = false;
    }
    // stop here if form is invalid
    if (this.profileForm.invalid) {
      console.log("Wrong");
        return;
    }    
  }
  
  get f() { return this.profileForm.controls; }

  checkEmail(group: FormGroup) { // here we have the 'passwords' group
  const password = group.get('password').value;
  const confirmPassword = group.get('confirmPassword').value;
  return password === confirmPassword ? null : { notSame: true }     
}

  ValidateMobile(control: AbstractControl): {[key: string]: any} | null  {
    if (!control.value.match(/^[0-9]*$/)) {
      return { 'phoneNumberInvalid': true };
    }
    if (control.value && control.value.length != 10) {
      return {'lengthInvalid' : true}
    }
    return null;
  }

  Validatepassword(control: AbstractControl): {[key: string]: any} | null  {
    let validations = {
      'capitalMissing':false,
      'smallMissing':false,
      'numberMissing': false,
      'specialCharMissing':false,
      'lengthInvalid': false
    };
    var count = 0;
    if (!(control.value.match(/^(?=[^A-Z]*[A-Z]).{1,}$/))) {
      validations['capitalMissing']=true;
      count++;
    }
    if (!(control.value.match(/^(?=[^a-z]*[a-z]).{1,}$/))) {
      validations['smallMissing']=true;
      count++;
    }
    if (!(control.value.match(/^(?=[^0-9]*[0-9]).{1,}$/))) {
      validations['numberMissing']=true;   
      count++;

    }
    if (!(control.value.match(/^(?=[^!@#\$%\^\&*\)\(+=._-]*[!@#\$%\^\&*\)\(+=._-]).{1,}$/))) {
      validations['specialCharMissing']=true;
      count++;
    }
    if (control.value.length > 12 || control.value.length <6 ) {
      validations['lengthInvalid']=true;
      count++;
    }
    if(count > 0)
      return validations;
    return null;
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    return password === confirmPassword ? null : { notSame: true }     
  }

  selectFile(event) {
		if(!event.target.files[0] || event.target.files[0].length == 0) {
			return;
		}
		
		var mimeType = event.target.files[0].type;
		
		if (mimeType.match(/image\/*/) == null) {
			return;
		}
		
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.imageUrl = reader.result; 
		}
	}
}
