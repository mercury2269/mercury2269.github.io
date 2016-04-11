---
layout: page
title: "Powershell Commands And Notes"
meta-description: ""
tags: ["powershell"]
categories: []
migrated: "true"
permalink: "/powershell/"
---
### Get-Help

Powershell has great documentation inside of the shell, including examples. To turn on complete documentation add -full argument.

	Get-Help [command name or topic]
	Get-Help [command name or topic] -full

All powershell commands start with a verb and followed by a noun.

### Get-Command
To get a list of commands:

	Get-command

All commands related to process or noun

	get-command -noun process

All commands that have a verb

	get-command -verb get


#### Commands

List of processes

	get-process

To stop process and get help on the command, to see examples.

	get-help stop-process -full	


#### What if?

Almost all commands have -WhatIf argument, you can try a command before executing.

#### Pipe

One of the most powerful features. Take output and "Pipe" to the next command get-process | sort-object

	get-process | sort-object -property Id

To see the list of all available properties from the command

	get-process | get-member

### Get-Member

Think of it when you have a question, what do I have, or what does this object have. 


#### Filtering and blocks

	get-process | where-object { $_.processname -eq 'powershell' }

Curly braces represent the filter block. The $_ represents the current item.

	get process | where-object { $_.CPU -gt 1 } | foreach-object { $_.processname + " is over threashold " }

Outputting to the file

	get process | where-object { $_.CPU -gt 1 } | foreach-object { $_.processname + " is over threashold " } | out-file cpuinfo.txt

### Execution policy 

	Get-ExecutionPolicy

You won't be able to run any scripts if the scripts are restricted. 
To change execution policy.

	Set-ExecutionPolicy remotesigned


### Scripts

Once you have your execution policy set to remotesigned you can execute scripts that were created on the local machine. Save scripts with .ps1 extension. And script can be executed by providing a path to the script in the powershell. Like ./somescript.ps1. First dot stands for the current directory.


### Great Topics with Get-Help

    Get-Help About_Execution_Policies
    Get-Help About_Operators
    Get-Help About_Common_Parameters
    Get-Help About_Pipelines
    Get-Help About_Scripts
    Get-Help About_*

#Creating scripts to start applications and more.

Typing is better than clicking.
Automate tasks that are common with windows explorer.

Get your current location

	get-location
	$pwd
	gl

To change your location:

	set-location /.documents
	chdir ..
	cd ./documents

Push location will save your current location before moving to the new location. Once you are done use pop-location to get back to where you were before.

	push-location /
	pushd ~/desktop
	pop-location
	popd

Common use is to control the location inside of the script

### Navigation

Drive -> Folder -> file

Powershell treats many things like drives, for example registry, functions and system drives.

	get-psdrive

You can cd into certificate stores

	cd cert:
	dir

Environment
	
	cd env:
	dir

Registry

	cd hkcu:
	dir

Push and pop work on custom drives.

#### Item commands
This are very useful.

	get-command *item

#### Invoke-item

Equivalent as double click, will open with default registered file.
Alias

	ii message.txt

Will open folder if set to the folder.

http://bit.ly/psphere to add to the windows explorer open in powershell

	
### Automating projects

	cd ~/documents/project
	push-location "~/documents/project/test"


    function push-project( $project ) 
	{ 
		# 1: navigate powershll to the project folder
		pushd "~/document/project/$project"
		# 2: open windows explorer at the project folder
    	invoke-item .;
		# 3: open any solution found in the project folder
    	invoke-item *.sln;
    }


### Profiles

Powershell saves scripts into the users profile

	$profile

Create a profile script file

	new-item -type file -path $profile
	invoke-item $profile

You can add the function to your user profile. And you can add an alias for the function

	new-alias -name pp -value push-project

There are 4 profile scripts in powershell

	$profile | select *

	Get-Help *Location
	Get-Help *Item
	Get-Help About_Providers
	Get-Help About_Functions
	Get-Help About_Profiles