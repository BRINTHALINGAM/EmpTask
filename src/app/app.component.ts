import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit {
  employees: any[] = [];
  pieChartData: any[] = [];
  colorScheme: string = 'vivid'; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.http.get<any[]>('https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==')
      .subscribe(data => {
        this.employees = data.map(entry => ({
          name: entry.EmployeeName,
          department: 'Unknown', // Placeholder for department data
          totalTimeWorked: this.calculateTotalTime(entry.StarTimeUtc, entry.EndTimeUtc)
        }));
        this.updatePieChartData();
      });
  }
  calculateTotalTime(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Handle cases where end time is before start time
    if (end < start) {
      console.error(`End time ${endTime} is before start time ${startTime}.`);
      return 0;
    }

    const totalMilliseconds = end.getTime() - start.getTime();
    return totalMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
  }

  editEmployee(employee: any): void {
    
    console.log('Editing employee:', employee);
}

updatePieChartData(): void {
  // Process the employee data to generate pie chart data
  this.pieChartData = this.employees.map(emp => ({
    name: emp.name,
    value: emp.totalTimeWorked 
  }));
}
}
