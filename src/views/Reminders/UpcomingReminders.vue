<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Upcoming Reminders</h3>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <base-table thead-classes="thead-light"
                  :data="upcomingReminders">
        <template slot="columns">
          <th>Details</th>
          <th>Date</th>
        </template>

        <template slot-scope="{row}">
          <th scope="row">
            {{row.reminder}}
          </th>
          <td>
            {{row.reminderDate}}
          </td>
          <td>
            {{row.unique}}
          </td>
        </template>

      </base-table>
    </div>

  </div>
</template>
<script>
  export default {
    props:['upcomingReminders'],
    name: 'upcoming-reminders',
  }
</script>
<style>
</style>
