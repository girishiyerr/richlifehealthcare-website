// Global function for toggling messages
function toggleMessage(idx) {
  const shortSpan = document.getElementById('msg-short-' + idx);
  const fullSpan = document.getElementById('msg-full-' + idx);
  const btn = document.querySelector(`[data-idx="${idx}"]`);
  
  if (!shortSpan || !fullSpan || !btn) {
    console.log('Elements not found:', { shortSpan, fullSpan, btn });
    return;
  }
  
  console.log('Toggling message:', idx, 'Short display:', shortSpan.style.display, 'Full display:', fullSpan.style.display);
  
  // Check if we're currently showing the short version
  const isShowingShort = shortSpan.style.display !== 'none';
  
  if (isShowingShort) {
    // Currently showing short, switch to full
    shortSpan.style.display = 'none';
    fullSpan.style.display = 'inline';
    btn.textContent = 'Show less';
    console.log('Switched to full message');
  } else {
    // Currently showing full, switch to short
    shortSpan.style.display = 'inline';
    fullSpan.style.display = 'none';
    btn.textContent = 'Show more';
    console.log('Switched to short message');
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  const loadingDiv = document.getElementById('admin-dashboard-loading');
  const tableDiv = document.getElementById('admin-dashboard-table');
  if (!loadingDiv || !tableDiv) return;
  loadingDiv.textContent = 'Loading appointments...';
  if (typeof supabase === 'undefined') {
    loadingDiv.textContent = 'Supabase client not found.';
    return;
  }
  try {
    const { data, error } = await supabase.from('appointments').select('*').order('date', { ascending: false });
    if (error) {
      loadingDiv.textContent = 'Error loading appointments.';
      return;
    }
    loadingDiv.style.display = 'none';
    if (!data || data.length === 0) {
      tableDiv.innerHTML = '<p>No appointments found.</p>';
      return;
    }
    let html = '<div style="overflow-x:auto;"><table style="width:100%;table-layout:auto;border-collapse:collapse;">';
    html += '<tr><th>Name</th><th>Email</th><th>Phone</th><th>Package</th><th>Date</th><th>Slot</th><th>Message</th></tr>';
    data.forEach((app, idx) => {
      let msg = app.message || '';
      let needsToggle = msg.length > 100;
      let shortMsg = needsToggle ? msg.slice(0, 100) + '...' : msg;
      html += `<tr>
        <td>${app.name || ''}</td>
        <td>${app.email || ''}</td>
        <td>${app.phone || ''}</td>
        <td>${app.package || ''}</td>
        <td>${app.date || ''}</td>
        <td>${app.slot || ''}</td>
        <td style="white-space:normal;max-width:300px;">
          <div class="message-container">
            <span class="msg-short" id="msg-short-${idx}" style="display:${needsToggle ? 'inline' : 'inline'};">${shortMsg}</span>
            <span class="msg-full" id="msg-full-${idx}" style="display:none;">${msg}</span>
            ${needsToggle ? `<button class="toggle-msg-btn" data-idx="${idx}">Show more</button>` : ''}
          </div>
        </td>
      </tr>`;
    });
    html += '</table></div>';
    tableDiv.innerHTML = html;
    
    // Remove any existing event listeners and add new ones
    const existingButtons = document.querySelectorAll('.toggle-msg-btn');
    existingButtons.forEach(btn => {
      btn.removeEventListener('click', btn._toggleHandler);
    });
    
    // Add event listeners for show more/less buttons
    document.querySelectorAll('.toggle-msg-btn').forEach(btn => {
      const toggleHandler = function() {
        const idx = this.getAttribute('data-idx');
        console.log('Button clicked for idx:', idx);
        toggleMessage(idx);
      };
      
      btn._toggleHandler = toggleHandler; // Store reference to remove later
      btn.addEventListener('click', toggleHandler);
    });
  } catch (err) {
    loadingDiv.textContent = 'Error loading appointments.';
    console.error('Error:', err);
  }
}); 