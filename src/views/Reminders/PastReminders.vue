<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Past Reminders</h3>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <base-table thead-classes="thead-light"
                  :data="pastReminders">
        <template slot="columns">
          <th>Reminder</th>
          <th>Date</th>
        </template>

        <template slot-scope="{row}">
           <th scope="row">
            {{row.reminder}}
          </th>
          <td>
            {{row.reminderFormattedDate }}
          </td>
        </template>

      </base-table>
    </div>

  </div>
</template>
<script>
  export default {
    props:['pastReminders'],
    name: 'past-reminders',
    methods:{
      replayReminder(){

      }
    }
  }
</script>
<style>
</style>
