import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../blog.servise';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

interface BlogCreateData {
  title: string;
  content: string;
  user_id: string;
  image?: string;
  image_filename?: string;
}

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

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decodedToken: any = jwtDecode(token);
            return decodedToken['sub'];
        } catch (e) {
            console.error("Greška pri dekodiranju tokena:", e);
            return null;
        }
    }
    return null;
}

  onSubmit(): void {
    if (this.blogForm.invalid) {
        alert('Molimo popunite sva obavezna polja (Naziv i Sadržaj).');
        return;
      }

    const dataToSend: BlogCreateData = {
        title: this.blogForm.value.title,
        content: this.blogForm.value.content,
        user_id: this.getUserIdFromToken() || ''
      };
    
    if (this.selectedFile) {
        const reader = new FileReader();
        
        reader.onload = () => {
            const base64String = reader.result as string;
            const base64Image = base64String.split(',')[1]; 
            
            dataToSend.image = base64Image;
            dataToSend.image_filename = this.selectedFile!.name;
            console.log('Original Base64 prefix:', base64String.substring(0, 50)); // Proveri da li počinje sa "data:image/..."
            console.log('Extracted Base64 (first 50 chars):', base64Image ? base64Image.substring(0, 50) : 'No image');
            console.log('Extracted Base64 length:', base64Image ? base64Image.length : 0);
            
            try {
                atob(base64Image);
                console.log('Client-side Base64 decode successful.');
            } catch (e) {
                console.error('Client-side Base64 decode failed:', e);
                alert('Greška pri Base64 kodiranju slike na klijentu.');
                return;
            }
            this.callCreateBlog(dataToSend);
        };
        
        reader.onerror = (error) => {
            console.error("Greška pri čitanju fajla:", error);
            alert("Greška pri čitanju fajla.");
        };

        reader.readAsDataURL(this.selectedFile);
    } else {
        this.callCreateBlog(dataToSend);
    }
}

  callCreateBlog(data: any): void {
    this.blogService.createBlog(data).subscribe({
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