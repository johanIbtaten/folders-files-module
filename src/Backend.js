function uuid() {
  return Math.random()
    .toString(16)
    .slice(2);
}

// Categories //

function saveCategoriesPosition(categories) {
  return new Promise(resolve => {
    //ajax goes here
    console.log(
      'ajax call categories',
      categories.map(category => category.id)
    );

    resolve({
      success: true,
      message: null
    });
  });
}

function addCategory(name) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call add category', { name });

      resolve({
        success: true,
        message: { category: { id: uuid(), name } }
      });
    }, 1000);
  });
}

function updateCategory(category) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call update category', category);

      resolve({
        success: true,
        message: null
      });
    }, 1000);
  });
}

function deleteCategory(categoryId) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call delete category', categoryId);

      resolve({
        success: true,
        message: null
      });
    }, 1000);
  });
}

// Snippets //

function saveSnippetsPosition(snippets) {
  return new Promise(resolve => {
    //ajax goes here
    console.log(
      'ajax call snippets',
      snippets.map(snippet => {
        return {
          id: snippet.id,
          category_id: snippet.category_id,
          position: snippet.position
        };
      })
    );

    resolve({
      success: true,
      message: null
    });
  });
}

function saveSnippet(snippetToSave) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call save snippet', {
        id: snippetToSave.id,
        title: snippetToSave.title,
        contents: snippetToSave.contents
      });
      resolve({
        success: true,
        message: null
      });
    }, 1000);
  });
}

function getEmptySnippet() {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call get empty snippet');

      resolve({
        success: true,
        message: {
          snippet: {
            id: uuid(),
            title: '',
            category_id: 0,
            position: 1000,
            contents: [
              {
                language_id: 1,
                content: ''
              },
              {
                language_id: 2,
                content: ''
              },
              {
                language_id: 3,
                content: ''
              }
            ]
          }
        }
      });
    }, 1000);
  });
}

function deleteSnippet(snippetId) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call delete snippet', snippetId);

      resolve({
        success: true,
        message: null
      });
    }, 1000);
  });
}

// Datas //

function load() {
  return new Promise(resolve => {
    let response = {
      success: true,
      message: {
        folders: [
          {
            id: 1,
            name: "Campagne d'été",
            items: [1, 2]
          },
          {
            id: 2,
            name: "Campagne d'hiver",
            items: []
          },
          {
            id: 3,
            name: 'Mes tests de campagnes',
            items: [3, 4]
          }
        ],
        items: [
          {
            id: 1,
            name: 'Joyeuse Saint Valentin',
            status: 'draft',
            'status possible values': 'possible values : draft/planned/sent',
            created_at: '2020-05-11 12:00:00',
            date_scheduled: '2020-05-11 12:00:00',
            date_sent: '2020-05-11 12:00:00',
            recipient_count: '2020-05-11 12:00:00',
            opened_count: '2020-05-11 12:00:00',
            clicked_count: '2020-05-11 12:00:00',
            sending_list: [
              {
                name: 'Liste de mes clients',
                total_customer: 5122
              }
            ],
            routes: {
              edit: '/crm/edit',
              reporting: '/crm/reporting'
            }
          },
          {
            id: 2,
            name: "L'été approche !",
            status: 'planned',
            created_at: '2020-05-11 12:00:00',
            date_scheduled: '2020-05-11 12:00:00',
            date_sent: '2020-05-11 12:00:00',
            recipient_count: '2020-05-11 12:00:00',
            opened_count: '2020-05-11 12:00:00',
            clicked_count: '2020-05-11 12:00:00',
            sending_list: [
              {
                name: 'Liste de mes clients',
                total_customer: 5122
              }
            ],
            routes: {
              edit: '/crm/edit',
              reporting: '/crm/reporting'
            }
          },
          {
            id: 3,
            name: 'Le printemps approche !',
            status: 'sent',
            created_at: '2020-05-11 12:00:00',
            date_scheduled: '2020-05-11 12:00:00',
            date_sent: '2020-05-11 12:00:00',
            recipient_count: '2020-05-11 12:00:00',
            opened_count: '2020-05-11 12:00:00',
            clicked_count: '2020-05-11 12:00:00',
            sending_list: [
              {
                name: 'Liste de mes clients',
                total_customer: 5122
              },
              {
                name: 'Another list',
                total_customer: 5122
              }
            ],
            routes: {
              edit: '/crm/edit',
              reporting: '/crm/reporting'
            }
          },
          {
            id: 4,
            name: "L'automne approche !",
            status: 'sent',
            created_at: '2020-05-11 12:00:00',
            date_scheduled: '2020-05-11 12:00:00',
            date_sent: '2020-05-11 12:00:00',
            recipient_count: '2020-05-11 12:00:00',
            opened_count: '2020-05-11 12:00:00',
            clicked_count: '2020-05-11 12:00:00',
            sending_list: [
              {
                name: 'Liste de mes clients',
                total_customer: 5122
              }
            ],
            routes: {
              edit: '/crm/edit',
              reporting: '/crm/reporting'
            }
          }
        ]
      }
    };

    resolve(response);
  });
}

export default {
  load,
  saveCategoriesPosition,
  addCategory,
  updateCategory,
  deleteCategory,
  saveSnippetsPosition,
  saveSnippet,
  getEmptySnippet,
  deleteSnippet
};