import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../blog.servise';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-blog',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-blog.html',
  styleUrl: './add-blog.css'
})
export class AddBlog {
  blogForm!: FormGroup;
  selectedFile: File | null = null; 

  constructor(
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.blogForm = new FormGroup({
      title: new FormControl('', Validators.required), 
      content: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      alert('Molimo popunite sva obavezna polja (Naziv i Sadržaj).');
      return;
    }

    const formData = new FormData();
    
    formData.append('title', this.blogForm.value.title);
    formData.append('content', this.blogForm.value.content);
    
    if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    
    this.blogService.createBlog(formData).subscribe({
      next: () => {
        alert('Blog uspešno kreiran!');
        this.router.navigate(['/blogs']); 
      },
      error: (err: any) => {
        console.error('Greška prilikom kreiranja bloga:', err);
        alert('Došlo je do greške prilikom kreiranja. Proverite konzolu.');
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    } else {
      this.selectedFile = null;
    }
  }
}
